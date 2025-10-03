import jwt from 'jsonwebtoken';

interface TokenPayload {
  sub: string;
  email: string;
  name: string;
}

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is missing');
  }
  return secret;
};

export const signAuthToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' });
};

export const verifyAuthToken = (token: string): TokenPayload => {
  return jwt.verify(token, getSecret()) as TokenPayload;
};
