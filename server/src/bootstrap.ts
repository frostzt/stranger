import path from 'path';
import dotenv from 'dotenv';
import express, { Application } from 'express';

// Load the env vars based on the current NODE_ENV
dotenv.config({ path: `../.env.${process.env.NODE_ENV}` });

class ExpressApplication {
  public app: Application;

  constructor(private port: string | number) {
    this.app = express();
    this.port = port;
  }

  private configureAssets() {
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  public start() {
    this.configureAssets();
    this.app.listen(this.port, () => {
      console.log(`Application started listening on port ${this.port}`);
    });
  }
}

export default ExpressApplication;
