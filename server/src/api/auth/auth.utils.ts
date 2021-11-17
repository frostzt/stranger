import { sign } from 'jsonwebtoken';

/**
 * Sign payload as JWT Token
 * @param payload Payload to encode as JWT
 * @returns JWTEncoded String
 */
export const signToken = (payload: any) =>
  sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export default signToken;
