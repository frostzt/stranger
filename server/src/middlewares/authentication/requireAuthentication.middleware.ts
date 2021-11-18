import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { Request, Response, NextFunction } from 'express';
import UnauthorizedError from '../../errors/UnauthorizedError.error';
import User from '../../models/User.model';
import AuthenticatedUser from '../../interfaces/AuthenticatedUser.interface';

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
  email: string;
  username: string;
}

/**
 * Middleware for protecting routes, also sets the current user as req.user in the Request Object
 * @param req Request Object
 * @param res Response Object
 * @param next NextFunction
 */
const requireAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  let token: string = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // array destructuring not possible since the index 1 is huge and random
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new UnauthorizedError('You are not logged in, please login to access this route.');
  }

  // @ts-expect-error jwt.verify takes two args whereas promisifying makes the invoked function take only one
  const decodedToken: DecodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET!);

  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    throw new UnauthorizedError('The user belonging to this token does not exist!');
  }

  const filteredUser: AuthenticatedUser = {
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    username: currentUser.username,
    createdAt: currentUser.createdAt,
    servers: currentUser.servers,
  };

  // Grant access
  // @ts-expect-error Request does not have the user object this is being appended
  req.user = filteredUser;

  next();
};

export default requireAuthentication;
