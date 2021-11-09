import { Request, Response } from 'express';

export default class InternalServerError {
  constructor(private _request: Request, private response: Response, private message: string) {}

  throwError() {
    return this.response.status(500).json({ message: this.message });
  }
}
