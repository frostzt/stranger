import SuccessStatus from '../Enums/SuccessStatus.enum';

export default abstract class ResponseConstructor<T> {
  abstract statusCode: number;

  abstract status: SuccessStatus;

  abstract data: T;

  constructor() {
    Object.setPrototypeOf(this, ResponseConstructor.prototype);
  }

  abstract send(): void;
}
