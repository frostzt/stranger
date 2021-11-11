import { NextFunction, Request, Response } from 'express';

import UserRoles from '../Enums/UserRoles.enum';
import logger from '../lib/logger';

const restrictTo = (roles: UserRoles) => (_req: Request, _res: Response, next: NextFunction) => {
  logger.info(`restricted to ${roles}`);

  next();
};

export default restrictTo;
