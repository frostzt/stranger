import { NextFunction, Response } from 'express';

import UserRoles from '../../Enums/UserRoles.enum';
import UnauthorizedError from '../../errors/UnauthorizedError.error';
import AuthenticatedRequest from '../../interfaces/AuthenticatedRequest.interface';

/**
 * Middleware for restricting a certain resource to a specific role
 * @param role could be either USER | ADMIN
 */
const restrictTo = (role: UserRoles) => (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  if (req.user.role !== role) {
    throw new UnauthorizedError("Sorry you're not authorized to access this resource.");
  }

  next();
};

export default restrictTo;
