import { Request, Response } from 'express';

import UserSignupDTO from './dtos/userSignup.dto';

import DuplicateEntityError from '../../errors/DuplicateEntityError.error';

import User, { UserDoc } from '../../models/User.model';
import SuccessStatus from '../../Enums/SuccessStatus.enum';
import SendSuccessResponse from '../../responses/SendSuccessResponse.response';

export default class AuthService {
  public async signUp(req: Request, res: Response) {
    const { name, username, email, password }: UserSignupDTO = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new DuplicateEntityError({ message: 'User already exists', param: 'user' });
    }

    // Create a new user
    const newUser = User.build({
      name,
      username,
      email,
      password,
    });
    await newUser.save();

    return new SendSuccessResponse<UserDoc>(res, 201, SuccessStatus.CREATED, newUser);
  }
}
