import CustomError from './CustomError';

export default class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
