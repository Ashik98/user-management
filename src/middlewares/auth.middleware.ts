import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { JwtUtil } from '../utils/jwt.util';
import { asyncHandler } from '../utils/asyncHandler';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided. Please authenticate', 401);
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = JwtUtil.verifyAccessToken(token);

    if (decoded.type !== 'access') {
      throw new AppError('Invalid token type', 401);
    }

    // Get user from database
    const user = await userService.findById(decoded.userId);

    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    if (!user.isActive) {
      throw new AppError('User account is deactivated', 401);
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  },
);
