import express from 'express';

// Decorators
import Get from '../../decorators/RouteDecorators/get.decorator';

class UserController {
  public path = '/api/users';

  public router;

  constructor() {
    this.router = express.Router();
    this.init();
  }

  // Initialize the routes
  @Get()
  init() {
    this.router.get(this.path, (req, res) => res.send('test'));
  }
}

export default new UserController().router;
