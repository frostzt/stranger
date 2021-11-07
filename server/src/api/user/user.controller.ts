import { Request, Response } from 'express';

// Decorators
import Controller from '../../decorators/RouteDecorators/controller.decorator';
import { Get } from '../../decorators/RouteDecorators/handlers.decorator';

import UserService from './user.service';

@Controller('/api/users')
class UserController {
  private userService;

  constructor() {
    this.userService = new UserService();
  }

  @Get('')
  public async getUsers(req: Request, res: Response) {
    return this.userService.getUser(req, res);
  }
}

export default UserController;
