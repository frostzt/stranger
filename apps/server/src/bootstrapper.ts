import express, { Application, Handler } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { WebSocketServer } from 'ws';
import { IRouter } from './decorators/RouteDecorators/handlers.decorator';
import DatabaseError from './errors/DatabaseError.error';
import EnvironmentalVariableNotFoundError from './errors/EnvironmentalVariableNotFoundError.error';
import NotFoundError from './errors/NotFoundError.error';
import globalErrorHandler from './middlewares/globalErrorHandler.middleware';
import swaggerOptions from './swagger.json';
import logger from './utils/logger';
import MetadataKeys from './utils/metadata.keys';

class ExpressApplication {
  private app: Application;

  private httpServer: HTTPServer;

  private dbUrl: string;

  public io;

  constructor(private port: string | number, private middlewares: any[], private controllers: any[]) {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new WebSocketServer({ server: this.httpServer });
    this.port = port;
    this.dbUrl = process.env.DATABASE_URL!;

    // Initialize
    this.verifyEnvironmentalVariables();
    this.initDatabase();
    this.setupMiddlewares(this.middlewares);
    this.setupRoutes(this.controllers);
    this.setupSwagger();
    this.configureAssets();
    this.setupLogger();

    this.handleNotFound();
    this.globalErrorHandler();
  }

  private async verifyEnvironmentalVariables() {
    logger.info('Setting up env variables, if this throws an error please check envs!');
    if (
      !process.env.JWT_SECRET ||
      !process.env.JWT_EXPIRES_IN ||
      !process.env.REFRESH_TOKEN_EXPIRES_IN ||
      !process.env.DATABASE_URL
    ) {
      throw new EnvironmentalVariableNotFoundError();
    }
  }

  private async initDatabase() {
    logger.info('Connecting to database...');
    try {
      await mongoose.connect(this.dbUrl);
      logger.info('Connected to database...');
    } catch (error) {
      logger.error(error);
      throw new DatabaseError();
    }
  }

  // Configure and plug in middlewares
  private setupMiddlewares(middlewaresArr: any[]) {
    logger.info('Setting up middlewares...');
    middlewaresArr.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  // Configure routes
  private setupRoutes(controllers: any[]) {
    logger.info('Setting up routes...');
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

    console.table(info);
  }

  private configureAssets() {
    logger.info('Setting up static assets...');
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  // The morgan route-logger will work only for the development env
  private setupLogger() {
    logger.info('Setting up morgan for dev logging...');
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
  }

  private setupSwagger() {
    logger.info('Setting up Swagger docs, check them on /api/documentation');
    this.app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(swaggerOptions));
  }

  // pass the thrown errors to the globalErrorHandler
  private handleNotFound() {
    this.app.all('*', () => {
      throw new NotFoundError();
    });
  }

  private globalErrorHandler() {
    this.app.use(globalErrorHandler);
  }

  public start() {
    return this.httpServer.listen(this.port, () => {
      logger.info(`Application started listening on port ${this.port}`);
    });
  }
}

export default ExpressApplication;
