// FILE: backend/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Access token required',
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'User not found or account deactivated',
      });
      return;
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid or expired access token',
    });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole('ADMIN');
export const requireAdminOrStaff = requireRole('ADMIN', 'STAFF');
