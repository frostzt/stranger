import { NextFunction, Request, Response } from 'express';

import logger from '../lib/logger';
import CustomError from '../errors/CustomError';
import DatabaseError from '../errors/DatabaseError.error';

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // required for the error handler to work since next is required to be called
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
  // needs to be disabled for the function to work
  // eslint-disable-next-line consistent-return
) => {
  // If error is related to DB send response and send a SIGTERM
  if (err instanceof DatabaseError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return process.kill(process.pid, 'SIGTERM');
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // @ts-expect-error if this block is executed means it was a MongoServerError: Duplicate Fields
  // however properties of MongoServerError are not present on Error
  if (err.code === 11000) {
    const error = err as any;
    const duplicates = Object.keys(error.keyValue).map((item) => item);

    return res
      .status(400)
      .json({ errors: duplicates.map((item) => ({ message: `${item} is already taken.`, param: item })) });
  }

  // CastError points to failure by mongoose to convert the supplied ObjectID string to a real ObjectID
  if (err.name === 'CastError') {
    const error = err as any;
    return res.status(400).json({ errors: [{ message: `Invalid ${error.path}: ${error.value}` }] });
  }

  // Handle JWT Token expired
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ errors: [{ message: 'Token expired please login again.' }] });
  }

  logger.error(JSON.parse(JSON.stringify(err)));

  res.status(500).send({
    errors: [{ message: 'Um, I guess something broke?! I am on it!' }],
  });
};

export default globalErrorHandler;
