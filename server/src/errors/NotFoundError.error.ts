import CustomError from './CustomError';

export default class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('This route was not found on the server!');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not found!' }];
  }
}
