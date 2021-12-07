import { Request, Response } from 'express';
import AuthenticatedRequest from '../../interfaces/AuthenticatedRequest.interface';

// Decorators
import Controller from '../../decorators/RouteDecorators/controller.decorator';
import { Get } from '../../decorators/RouteDecorators/handlers.decorator';

// Middlewares
import restrictTo from '../../middlewares/authentication/restrictTo.middleware';
import requireAuthentication from '../../middlewares/authentication/requireAuthentication.middleware';

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

  /**
   * Get all the users from the db, protected and restricted to ADMINs
   * @param req Request Object
   * @param res Response Object
   * @returns Array containing all the users
   */
  @Get('', [requireAuthentication, restrictTo(UserRoles.ADMIN)])
  public async getUsers(req: Request, res: Response) {
    return this.userService.getUsers(req, res);
  }

  @Get('/me', [requireAuthentication])
  public async me(req: AuthenticatedRequest, res: Response) {
    return this.userService.me(req, res);
  }
}

export default UserController;
