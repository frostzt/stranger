import { body } from 'express-validator';
import { Request, Response } from 'express';

import AuthService from './auth.service';
import UserRoles from '../../Enums/UserRoles.enum';
import Controller from '../../decorators/RouteDecorators/controller.decorator';
import { Get, Post } from '../../decorators/RouteDecorators/handlers.decorator';
import restrictTo from '../../middlewares/authentication/restrictTo.middleware';
import AuthenticatedRequest from '../../interfaces/AuthenticatedRequest.interface';
import validateRequest from '../../middlewares/authentication/requestValidation.middleware';
import requireAuthentication from '../../middlewares/authentication/requireAuthentication.middleware';

@Controller('/api/auth')
export default class AuthController {
  private authService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Create a new user and return the status response containing user object and cookie
   * @param req Request object
   * @param res Response object
   * @returns Object containing user object and status
   */
  @Post('/signup', [
    [
      body('email').isEmail().withMessage('Email must be valid'),
      body('password')
        .trim()
        .isLength({ min: 4, max: 32 })
        .withMessage('Password must be between 4 and 20 characters long'),
      body('name').isLength({ min: 1 }).withMessage('Name must be provided'),
      body('username')
        .isLength({ min: 1, max: 35 })
        .withMessage('Username must be provided and should be less than 35 characters'),
    ],
    validateRequest,
  ])
  public async signUp(req: Request, res: Response) {
    return this.authService.signUp(req, res);
  }

  /**
   * Authenticate a user for first time login, NOT related to refreshToken, only for first
   * authentication and generating a new refreshToken
   * @param req Request object
   * @param res Response object
   * @returns Object containing user object and status
   */
  @Post('/signin', [
    [
      body('email').isEmail().withMessage('Email must be valid'),
      body('password').trim().isLength({ min: 1 }).withMessage('Please provide a password'),
    ],
    validateRequest,
  ])
  public async signIn(req: Request, res: Response) {
    return this.authService.signIn(req, res);
  }

  /**
   * Refreshes the accessToken for the user by providing a refreshToken in the cookies
   * @param req Request object
   * @param res Response object
   * @returns Object containing user object and new accessToken
   */
  @Post('/refreshToken')
  public async refreshToken(req: Request, res: Response) {
    return this.authService.refreshToken(req, res);
  }

  /**
   * Returns all the available all the refreshTokens
   * @param req Request object
   * @param res Response object
   * @returns Object containing array of all the tokens
   */
  @Get('/allTokens', [requireAuthentication, restrictTo(UserRoles.ADMIN)])
  public async allTokens(req: AuthenticatedRequest, res: Response) {
    return this.authService.allTokens(req, res);
  }
}
