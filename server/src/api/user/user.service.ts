import { Request, Response } from 'express';
import User from '../../models/User.model';
import SuccessStatus from '../../Enums/SuccessStatus.enum';
import SendSuccessResponse from '../../responses/SendSuccessResponse.response';
import AuthenticatedRequest from '../../interfaces/AuthenticatedRequest.interface';

export default class UserService {
  /**
   * @method GET
   * @route /api/users
   * @returns Array containing all the users
   */
  public async getUsers(_req: Request, res: Response) {
    const users = await User.find();

    return new SendSuccessResponse(res, 200, SuccessStatus.SUCCESS, { users });
  }

  public async me(req: AuthenticatedRequest, res: Response) {
    const { user } = req;
    console.log(req.user);

    return new SendSuccessResponse(res, 200, SuccessStatus.SUCCESS, { user });
  }
}
