import { ValidationError } from 'express-validator';

import CustomError from './CustomError';

export default class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Parameters validation failed!');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => ({ message: error.msg, field: error.param }));
  }
}
