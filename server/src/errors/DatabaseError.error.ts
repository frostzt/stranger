import CustomError from './CustomError';

export default class DatabaseError extends CustomError {
  statusCode = 500;

  constructor() {
    super('FAILED TO CONNECT TO DATABASE!');
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  serializeErrors() {
    return [{ message: 'There was an error from our side!' }];
  }
}
