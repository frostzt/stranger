import express, { Request, Response } from 'express';

// Decorators
// import Get from '../../decorators/RouteDecorators/get.decorator';

class UserController {
  public path = '/api/users';

  public router = express.Router();

  constructor() {
    this.init();
  }

  // Initialize the routes
  init() {
    this.router.get(this.path, (req: Request, res: Response) => {
      res.send('testing');
    });
  }
}

export default new UserController().router;
