import path from 'path';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express, { Application, Handler } from 'express';

import logger from './lib/logger';
import MetadataKeys from './utils/metadata.keys';
import swaggerOptions from './lib/swagger.configuration';
import { IRouter } from './decorators/RouteDecorators/handlers.decorator';

// Load the env vars based on the current NODE_ENV
dotenv.config({ path: `../.env.${process.env.NODE_ENV}` });

class ExpressApplication {
  private app: Application;

  constructor(private port: string | number, private middlewares: any[], private controllers: any[]) {
    this.app = express();
    this.port = port;

    // Initialize
    this.setupMiddlewares(middlewares);
    this.setupRoutes(controllers);
    this.configureAssets();
    this.setupLogger();
    this.setupSwagger();
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

      routers.forEach(({ method, handlerPath, handlerName }) => {
        expressRouter[method](handlerPath, controllerInstance[String(handlerName)].bind(controllerInstance));

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
    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    this.app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }

  public start() {
    this.app.listen(this.port, () => {
      logger.info(`Application started listening on port ${this.port}`);
    });
  }
}

export default ExpressApplication;
