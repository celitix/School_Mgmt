import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';

interface JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const generateCode = (length = 6, type = 'number') => {
  let chars = '';
  if (type === 'number') chars = '0123456789';
  else if (type === 'alpha') chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  else chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  const bytes = crypto.randomBytes(length);
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }

  return result;
};

export const hashValue = async (code: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(code, salt);
};

export const compareValue = async (code: string, encryptedCode: string) => {
  return await bcrypt.compare(code, encryptedCode);
};

export const generateAccessToken = (
  data: { id: string; role: string },
  expiresIn: SignOptions['expiresIn'] = '1d',
  secret: string,
) => {
  const token = jwt.sign(data, secret, {
    expiresIn,
  });
  return token;
};

export const extractTokenFromHeader = (authHeader?: string) => {
  if (!authHeader) return null;
  if (!authHeader.startsWith('Bearer ')) return null;

  return authHeader.split(' ')[1];
};

export const verifyToken = (token: string, secret: string) => {
  const decoded = jwt.verify(token, secret) as JwtPayload;
  return decoded;
};

export const isTokenExpired = (token: string) => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded?.exp) return true;

    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const isOtpExpired = (expiresAt: Date): boolean => {
  return Date.now() > expiresAt.getTime();
};

export const otpExpiry = (minutes = 5): Date => {
  return new Date(Date.now() + minutes * 60 * 1000);
};
