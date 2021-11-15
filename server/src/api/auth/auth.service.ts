import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import RequestValidationError from '../../errors/RequestValidationError.error';

import User from '../../models/User.model';

export default class AuthService {
  public async signUp(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({ msg: 'User exits' });
    }

    return res.send({
      email,
      password,
    });
  }
}
