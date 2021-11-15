import { Request, Response } from 'express';
import { body } from 'express-validator';
import AuthService from './auth.service';
import Controller from '../../decorators/RouteDecorators/controller.decorator';
import { Post } from '../../decorators/RouteDecorators/handlers.decorator';

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
    ],
  ])
  public async signUp(req: Request, res: Response) {
    return this.authService.signUp(req, res);
  }
}
