import path from 'path';
import morgan from 'morgan';
import dotenv from 'dotenv';
import express, { Application } from 'express';

import logger from './lib/logger';

// Load the env vars based on the current NODE_ENV
dotenv.config({ path: `../.env.${process.env.NODE_ENV}` });

class ExpressApplication {
  public app: Application;

  constructor(private port: string | number, private middlewares: any[], private routes: any[]) {
    this.app = express();
    this.port = port;

    // Initialize
    this.setupMiddlewares(middlewares);
    this.setupRoutes(routes);
    this.configureAssets();
    this.setupLogger();
  }

  // Configure and plug in middlewares
  private setupMiddlewares(middlewaresArr: any[]) {
    middlewaresArr.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  // Configure routes
  private setupRoutes(routesArr: any[]) {
    routesArr.forEach((route) => {
      this.app.use('/', route);
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

  public start() {
    this.app.listen(this.port, () => {
      logger.info(`Application started listening on port ${this.port}`);
    });
  }
}

export default ExpressApplication;
