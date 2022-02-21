import { Response } from 'express';
import SuccessStatus from '../Enums/SuccessStatus.enum';

import ResponseConstructor from './ResponseConstructor';

export default class SendSuccessResponse<U> extends ResponseConstructor<U> {
  constructor(public res: Response, public statusCode: number, public status: SuccessStatus, public data: U) {
    super();
    Object.setPrototypeOf(this, SendSuccessResponse.prototype);

    this.send();
  }

  public send() {
    this.res.status(this.statusCode).json({
      status: this.status,
      statusCode: this.statusCode,
      data: this.data,
    });
  }
}
