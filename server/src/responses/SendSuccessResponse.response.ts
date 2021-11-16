import { Response } from 'express';

import ResponseConstructor from './ResponseConstructor';

export default class SendSuccessResponse<U> extends ResponseConstructor<U> {
  constructor(public res: Response, public statusCode: number, public status: string, public data: U) {
    super();
    Object.setPrototypeOf(this, SendSuccessResponse.prototype);
  }

  public send() {
    this.res.status(this.statusCode).json({
      status: this.status,
      data: this.data,
    });
  }
}
