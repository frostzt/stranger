import { body } from 'express-validator';
import { Request, Response } from 'express';

import AuthService from './auth.service';
import { Post } from '../../decorators/RouteDecorators/handlers.decorator';
import Controller from '../../decorators/RouteDecorators/controller.decorator';

@Controller('/api/auth')
export default class AuthController {
  private authService;

  constructor() {
    this.authService = new AuthService();
  }

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
  ])
  public async signUp(req: Request, res: Response) {
    return this.authService.signUp(req, res);
  }
}
