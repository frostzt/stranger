import { Request, Response } from 'express';

import User from '../../models/User.model';
import UserSignupDTO from './dtos/userSignup.dto';
import SuccessStatus from '../../Enums/SuccessStatus.enum';
import RefreshToken from '../../models/RefreshToken.model';
import BadRequestError from '../../errors/BadRequestError.error';
import DuplicateEntityError from '../../errors/DuplicateEntityError.error';
import SendSuccessResponse from '../../responses/SendSuccessResponse.response';
import { comparePasswords, generateRefreshToken, setRefreshTokenCookie, signToken } from './auth.utils';

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

    // Generate JWT and set refreshToken
    const userJwt = signToken({ id: user.id, email: user.email, username: user.username });
    const refreshToken = generateRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken.rtoken);

    return new SendSuccessResponse(res, 201, SuccessStatus.CREATED, { user, accessToken: userJwt });
  }

  public async signIn(req: Request, res: Response) {
    const { email, password } = req.body;

    // Check for existing user
    const user = await User.findOne({ email });
    if (!user || !(await comparePasswords(password, user.password))) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT, revoke previous refreshToken if not done already generate a new rtoken and set as cookie
    const userJwt = signToken({ id: user.id, email: user.email, username: user.username });
    await RefreshToken.findOneAndUpdate({ user: user.id, revoked: false }, { revoked: true, revokedAt: new Date() });
    const refreshToken = generateRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken.rtoken);

    return new SendSuccessResponse(res, 200, SuccessStatus.SUCCESS, { user, accessToken: userJwt });
  }
}
