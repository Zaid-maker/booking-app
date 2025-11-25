import type { Context, Next } from 'hono';
import { verifyToken } from '../utils/jwt';

export interface AuthVariables {
  userId: string;
  email: string;
}

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return c.json({ error: 'Invalid token format' }, 401);
    }

    const decoded = verifyToken(token);
    c.set('userId', decoded.userId);
    c.set('email', decoded.email);

    await next();
  } catch (error) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
};
