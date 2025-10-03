import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { signAuthToken } from '../utils/jwt';
import { findUserByEmail } from '../db/userRepository';
import { findUserById } from '../db/userRepository';

const TOKEN_COOKIE_NAME = 'token';

export const loginValidators = [
  body('email').isEmail().withMessage('Provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password is required'),
];

export const loginHandler = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body as { email: string; password: string };
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signAuthToken({ sub: user.id, email: user.email, name: user.name });
  res
    .cookie(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    .json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
};

export const logoutHandler = (req: Request, res: Response) => {
  res.clearCookie(TOKEN_COOKIE_NAME).status(204).end();
};

export const meHandler = (req: Request, res: Response) => {
  const token = req.cookies?.[TOKEN_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json({ message: 'Authenticated' });
};
