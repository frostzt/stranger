import { body } from 'express-validator';
import { Request, Response } from 'express';

import AuthService from './auth.service';
import { Post } from '../../decorators/RouteDecorators/handlers.decorator';
import Controller from '../../decorators/RouteDecorators/controller.decorator';
import validateRequest from '../../middlewares/authentication/requestValidation.middleware';

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
}
