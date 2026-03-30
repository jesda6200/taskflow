import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../lib/tokens';

type AuthedRequest = Request & {
  user?: {
    id: string;
    email: string;
  };
};

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing bearer token' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET || 'dev-access-secret');
    (req as AuthedRequest).user = { id: decoded.sub, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

export function getUserId(req: Request): string {
  const userId = (req as AuthedRequest).user?.id;
  if (!userId) {
    throw new Error('Authenticated user missing');
  }
  return userId;
}
