import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import swaggerUi from 'swagger-ui-express';
import express, { Application, Handler } from 'express';

import logger from './lib/logger';
import swaggerOptions from './swagger.json';
import MetadataKeys from './utils/metadata.keys';
import { IRouter } from './decorators/RouteDecorators/handlers.decorator';
import globalErrorHandler from './middlewares/globalErrorHandler.middleware';
import NotFoundError from './api/errors/NotFound.error';

class ExpressApplication {
  private app: Application;

  private httpServer: HTTPServer;

  private dbUrl: string;

  public io;

  constructor(private port: string | number, private middlewares: any[], private controllers: any[]) {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new Server(this.httpServer);
    this.port = port;
    this.dbUrl = process.env.DATABASE_URL!;

    // Initialize
    this.connectToDatabase();
    this.setupMiddlewares(middlewares);
    this.setupRoutes(controllers);
    this.handleErrorsAndNotFound();
    this.configureAssets();
    this.setupLogger();
    this.setupSwagger();
  }

  private async connectToDatabase() {
    try {
      await mongoose.connect(this.dbUrl);
      logger.info('Connected to database...');
    } catch (error) {
      logger.error(error);
      throw new Error('There was an error connecting to the database...');
    }
  }

  // Configure and plug in middlewares
  private setupMiddlewares(middlewaresArr: any[]) {
    middlewaresArr.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  // Configure routes
  private setupRoutes(controllers: any[]) {
    const info: Array<{ api: string; handler: string }> = [];

    controllers.forEach((Controller) => {
      const controllerInstance: { [handleName: string]: Handler } = new Controller();

      const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, Controller);
      const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, Controller);

      const expressRouter = express.Router();

      routers.forEach(({ method, handlerPath, middlewares, handlerName }) => {
        if (middlewares) {
          expressRouter[method](
            handlerPath,
            ...middlewares,
            controllerInstance[String(handlerName)].bind(controllerInstance),
          );
        } else {
          expressRouter[method](handlerPath, controllerInstance[String(handlerName)].bind(controllerInstance));
        }

        info.push({
          api: `${method.toLocaleUpperCase()} ${basePath + handlerPath}`,
          handler: `${Controller.name}.${String(handlerName)}`,
        });
      });

      this.app.use(basePath, expressRouter);
    });
  }

  private configureAssets() {
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  // The morgan route-logger will work only for the development env
  private setupLogger() {
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
  }

  private setupSwagger() {
    this.app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(swaggerOptions));
  }

  // pass the thrown errors to the globalErrorHandler
  private handleErrorsAndNotFound() {
    this.app.all('*', () => {
      throw new NotFoundError();
    });

    this.app.use(globalErrorHandler);
  }

  public start() {
    return this.httpServer.listen(this.port, () => {
      logger.info(`Application started listening on port ${this.port}`);
    });
  }
}

export default ExpressApplication;
