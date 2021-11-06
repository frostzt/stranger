import express, { Request, Response } from 'express';

// Decorators
import Controller from '../../decorators/RouteDecorators/controller.decorator';
import { Get } from '../../decorators/RouteDecorators/handlers.decorator';

@Controller('/api/users')
class UserController {
  public router;

  constructor() {
    this.router = express.Router();
  }

  @Get('')
  public getUsers(req: Request, res: Response) {
    return res.send('testing');
  }
}

export default UserController;
