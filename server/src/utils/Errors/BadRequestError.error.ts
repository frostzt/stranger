import { Request, Response } from 'express';

export default class BadRequestError {
  constructor(private _request: Request, private response: Response, private message: string) {}

  throwError() {
    return this.response.status(400).json({ message: this.message });
  }
}
