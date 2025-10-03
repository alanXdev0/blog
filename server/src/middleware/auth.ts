import { Request, Response, NextFunction } from 'express';
import { verifyAuthToken } from '../utils/jwt';
import { findUserById } from '../db/userRepository';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = verifyAuthToken(token);
    const user = findUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Invalid session' });
    }
    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
