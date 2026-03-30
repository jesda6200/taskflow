import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

type JwtPayload = {
  sub: string;
  email: string;
};

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

export function signAccessToken(payload: JwtPayload, secret: string): string {
  return jwt.sign(payload, secret, { expiresIn: ACCESS_TTL });
}

export function signRefreshToken(payload: JwtPayload, secret: string): string {
  return jwt.sign(payload, secret, { expiresIn: REFRESH_TTL, jwtid: crypto.randomUUID() });
}

export function verifyToken(token: string, secret: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function refreshExpiryDate(): Date {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  return expires;
}
