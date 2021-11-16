export default abstract class ResponseConstructor<T> {
  abstract statusCode: number;

  abstract status: string;

  abstract data: T;

  constructor() {
    Object.setPrototypeOf(this, ResponseConstructor.prototype);
  }

  abstract send(): void;
}
