import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { AppError } from './AppError';

export interface JwtPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

export class JwtUtil {
  static generateAccessToken(payload: { userId: string; email: string }): string {
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new AppError('JWT_ACCESS_SECRET is not defined', 500);
    }

    const secret: Secret = process.env.JWT_ACCESS_SECRET;
    const options: SignOptions = {
      expiresIn: (process.env.JWT_ACCESS_EXPIRATION || '15m') as any,
    };

    return jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        type: 'access',
      },
      secret,
      options,
    );
  }

  static generateRefreshToken(payload: { userId: string; email: string }): string {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new AppError('JWT_REFRESH_SECRET is not defined', 500);
    }

    const secret: Secret = process.env.JWT_REFRESH_SECRET;
    const options: SignOptions = {
      expiresIn: (process.env.JWT_REFRESH_EXPIRATION || '7d') as any,
    };

    return jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        type: 'refresh',
      },
      secret,
      options,
    );
  }

  static verifyAccessToken(token: string): JwtPayload {
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new AppError('JWT_ACCESS_SECRET is not defined', 500);
    }

    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET as Secret) as JwtPayload;
    } catch {
      throw new AppError('Invalid or expired access token', 401);
    }
  }

  static verifyRefreshToken(token: string): JwtPayload {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new AppError('JWT_REFRESH_SECRET is not defined', 500);
    }

    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET as Secret) as JwtPayload;
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }
}
