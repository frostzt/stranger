import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import RefreshToken from '../../models/RefreshToken.model';
import { UserDoc } from '../../models/User.model';

const generateRandomTokenString = () => crypto.randomBytes(40).toString('hex');

/**
 * Sign payload as JWT Token
 * @param payload Payload to encode as JWT
 * @returns JWTEncoded String
 */
export const signToken = (payload: any) =>
  sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });

/**
 * Generate a refreshToken object and saves it in the DB
 * @param user The user document for whom the refreshToken is to be generated
 * @returns Object RefreshToken
 */
export const generateRefreshToken = (user: UserDoc) => {
  const refreshTokenObject = RefreshToken.build({
    user: user.id,
    rtoken: generateRandomTokenString(),
    expires: new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!, 10)),
  });
  refreshTokenObject.save();

  return refreshTokenObject;
};

/**
 * Set the refreshToken as cookie for the response to be sent
 * @param res Response Object for the subsequest Response to be sent
 * @param rtoken RefreshToken string generated when creating the RefreshToken
 */
export const setRefreshTokenCookie = (res: Response, rtoken: string): void => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN!, 10)),
  };
  res.cookie('refreshToken', rtoken, cookieOptions);
};

/**
 * Compares the candidatePassword supplied by the user to the password hash present in DB
 * @param candidatePassword Password string supplied by the user to be verified
 * @param password Hashed password string present in the database
 * @returns Boolean, true if it is matched else false
 */
export const comparePasswords = async (candidatePassword: string, password: string) => {
  const match = await bcrypt.compare(candidatePassword, password);
  return match;
};
