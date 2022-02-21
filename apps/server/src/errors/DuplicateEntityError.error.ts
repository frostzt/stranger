import CustomError from './CustomError';

interface EntityDescription {
  message: string;
  param?: string;
}

export default class DuplicateEntityError extends CustomError {
  statusCode = 400;

  constructor(public description: EntityDescription) {
    super(description.message);
    Object.setPrototypeOf(this, DuplicateEntityError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.description.message,
        param: this.description.param,
      },
    ];
  }
}
