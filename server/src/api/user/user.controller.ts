import { Request, Response } from 'express';

// Decorators
import Controller from '../../decorators/RouteDecorators/controller.decorator';
import { Get } from '../../decorators/RouteDecorators/handlers.decorator';

// Middlewares
import restrictTo from '../../middlewares/authentication/restrictTo.middleware';

// Service
import UserService from './user.service';

// utils
import UserRoles from '../../Enums/UserRoles.enum';

@Controller('/api/users')
class UserController {
  private userService;

  constructor() {
    this.userService = new UserService();
  }

  @Get('', [restrictTo(UserRoles.ADMIN)])
  public async getUsers(req: Request, res: Response) {
    return this.userService.getUser(req, res);
  }
}

export default UserController;
