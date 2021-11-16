import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import DuplicateEntityError from '../../errors/DuplicateEntityError.error';
import RequestValidationError from '../../errors/RequestValidationError.error';

import User, { UserDoc } from '../../models/User.model';
import SuccessStatus from '../../Enums/SuccessStatus.enum';
import SendSuccessResponse from '../../responses/SendSuccessResponse.response';

export default class AuthService {
  public async signUp(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { name, username, email, password } = req.body;

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
