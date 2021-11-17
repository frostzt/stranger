import { Request, Response, NextFunction } from 'express';

const requireAuthentication = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export default requireAuthentication;
