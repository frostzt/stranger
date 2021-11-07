import { sign } from 'jsonwebtoken';

const signToken = (payload: any) =>
  sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export default signToken;
