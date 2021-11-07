import { Request, Response } from 'express';

// TSOA

// Decorators
import Controller from '../../decorators/RouteDecorators/controller.decorator';
import { Get } from '../../decorators/RouteDecorators/handlers.decorator';

@Controller('/api/users')
class UserController {
  @Get('')
  public getUsers(req: Request, res: Response) {
    return res.send('testing');
  }
}

export default UserController;
