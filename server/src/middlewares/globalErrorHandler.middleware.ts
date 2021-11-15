import { NextFunction, Request, Response } from 'express';

import DatabaseError from '../errors/DatabaseError.error';
import CustomError from '../errors/CustomError';

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // required for the error handler to work since next is required to be called
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): Response<any, Record<string, any>> => {
  // If error is related to DB send response and send a SIGTERM
  if (err instanceof DatabaseError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    process.kill(process.pid, 'SIGTERM');
  }
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  return res.status(500).send({
    errors: [{ message: 'Um, I guess something broke?! I am on it!' }],
  });
};

export default globalErrorHandler;
