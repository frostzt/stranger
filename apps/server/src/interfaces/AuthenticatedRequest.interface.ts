import { Request } from 'express';
import AuthenticatedUser from './AuthenticatedUser.interface';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

export default AuthenticatedRequest;
