import { Request, Response } from 'express';

export default class UserService {
  public async getUser(req: Request, res: Response) {
    return res.send('testing and working');
  }
}
