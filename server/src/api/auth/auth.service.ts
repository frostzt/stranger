import { Request, Response } from 'express';

import User from '../../models/User.model';
import UserSignupDTO from './dtos/userSignup.dto';
import UserSignInDTO from './dtos/userSignin.dto';
import SuccessStatus from '../../Enums/SuccessStatus.enum';
import RefreshToken from '../../models/RefreshToken.model';
import BadRequestError from '../../errors/BadRequestError.error';
import DuplicateEntityError from '../../errors/DuplicateEntityError.error';
import SendSuccessResponse from '../../responses/SendSuccessResponse.response';
import AuthenticatedRequest from '../../interfaces/AuthenticatedRequest.interface';
import { comparePasswords, generateRefreshToken, setRefreshTokenCookie, signToken } from './auth.utils';

export default class AuthService {
  /**
   * @method POST
   * @route /api/auth/signUp
   * @returns Object with AccessToken and UserData, sets RefreshToken cookie
   */
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

  /**
   * @method POST
   * @route /api/auth/signIn
   * @returns Object with AccessToken and UserData, sets RefreshToken Cookie
   */
  public async signIn(req: Request, res: Response) {
    const { email, password }: UserSignInDTO = req.body;

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

  /**
   * @method POST
   * @route /api/auth/refreshToken
   * @returns Object with AccessToken and UserData
   */
  public async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.cookies;

    // Check for the user using refreshToken
    const rTokenObject = await RefreshToken.findOne({ rtoken: refreshToken });
    if (rTokenObject?.revoked || rTokenObject?.isExpired) {
      throw new BadRequestError('Your session has expired please login again!');
    }

    // Generate JWT and send it back
    const user = await User.findOne({ id: rTokenObject?.user });
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }
    const userJwt = signToken({ id: user.id, email: user.email, username: user.username });

    return new SendSuccessResponse(res, 200, SuccessStatus.SUCCESS, { user, accessToken: userJwt });
  }

  /**
   * @method GET
   * @restrictedTo ADMIN only
   * @route /api/auth/signUp
   * @returns Object with AccessToken and UserData, sets RefreshToken cookie
   */
  public async allTokens(_req: AuthenticatedRequest, res: Response) {
    const data = await RefreshToken.find();

    return new SendSuccessResponse(res, 200, SuccessStatus.SUCCESS, data);
  }
}
