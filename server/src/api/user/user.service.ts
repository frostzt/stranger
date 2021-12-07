import { Request, Response } from 'express';
import SuccessStatus from '../../Enums/SuccessStatus.enum';
import User from '../../models/User.model';
import SendSuccessResponse from '../../responses/SendSuccessResponse.response';

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
}
