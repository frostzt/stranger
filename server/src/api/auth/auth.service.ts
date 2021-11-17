import { Request, Response } from 'express';

import { signToken } from './auth.utils';
import User from '../../models/User.model';
import UserSignupDTO from './dtos/userSignup.dto';
import SuccessStatus from '../../Enums/SuccessStatus.enum';
import DuplicateEntityError from '../../errors/DuplicateEntityError.error';
import SendSuccessResponse from '../../responses/SendSuccessResponse.response';

export default class AuthService {
  public async signUp(req: Request, res: Response) {
    const { name, username, email, password }: UserSignupDTO = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new DuplicateEntityError({ message: 'Invalid credentials' });
    }

    // Create a new user
    const user = User.build({
      name,
      username,
      email,
      password,
    });
    await user.save();

    // Generate JWT
    const userJwt = signToken({ id: user.id, email: user.email, username: user.username });

    return new SendSuccessResponse(res, 201, SuccessStatus.CREATED, { user, userJwt });
  }
}
