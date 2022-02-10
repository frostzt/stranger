import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import RequestValidationError from '../../errors/RequestValidationError.error';

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};

export default validateRequest;
