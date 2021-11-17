import CustomError from './CustomError';

export default class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Unauthorized!');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "You're not authorized to access this route!" }];
  }
}
