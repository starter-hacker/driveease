// FILE: backend/src/controllers/auth.controller.ts

import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone } =
      registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already registered', StatusCodes.CONFLICT);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        loyaltyTier: true,
        createdAt: true,
      },
    });

    const { accessToken, refreshToken, tokenId } = generateTokenPair(
      user.id,
      user.email,
      user.role,
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to DriveEase!',
        message: `Hi ${firstName}, your account has been created. Start exploring our fleet!`,
        type: 'SUCCESS',
      },
    });

    sendCreated(
      res,
      { user, accessToken, refreshToken },
      'Account created successfully',
    );
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        loyaltyTier: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new AppError(
        'Your account has been deactivated. Contact support.',
        StatusCodes.FORBIDDEN,
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
    }

    const { accessToken, refreshToken } = generateTokenPair(
      user.id,
      user.email,
      user.role,
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: { userId: user.id, token: refreshToken, expiresAt },
    });

    const { password: _, ...userWithoutPassword } = user;

    sendSuccess(
      res,
      { user: userWithoutPassword, accessToken, refreshToken },
      'Login successful',
    );
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw new AppError('Refresh token required', StatusCodes.BAD_REQUEST);
    }

    const decoded = verifyRefreshToken(token);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: {
        user: { select: { id: true, email: true, role: true, isActive: true } },
      },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError(
        'Invalid or expired refresh token',
        StatusCodes.UNAUTHORIZED,
      );
    }

    if (!storedToken.user.isActive) {
      throw new AppError('Account deactivated', StatusCodes.FORBIDDEN);
    }

    await prisma.refreshToken.delete({ where: { token } });

    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role,
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: { userId: storedToken.user.id, token: newRefreshToken, expiresAt },
    });

    sendSuccess(
      res,
      { accessToken, refreshToken: newRefreshToken },
      'Token refreshed',
    );
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      await prisma.refreshToken.deleteMany({ where: { token } });
    }

    sendSuccess(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        driverLicense: true,
        dateOfBirth: true,
        loyaltyTier: true,
        isActive: true,
        createdAt: true,
        _count: { select: { bookings: true } },
      },
    });

    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const updateSchema = z.object({
      firstName: z.string().min(1).max(50).optional(),
      lastName: z.string().min(1).max(50).optional(),
      phone: z.string().optional(),
      driverLicense: z.string().optional(),
      dateOfBirth: z.string().optional(),
    });

    const data = updateSchema.parse(req.body);

    let avatarUrl: string | undefined;
    if (req.file) {
      avatarUrl = (req.file as Express.Multer.File & { path: string }).path;
    }

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...data,
        ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
        ...(avatarUrl && { avatar: avatarUrl }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        driverLicense: true,
        dateOfBirth: true,
        loyaltyTier: true,
      },
    });

    sendSuccess(res, user, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const schema = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/),
    });

    const { currentPassword, newPassword } = schema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, password: true },
    });

    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      throw new AppError(
        'Current password is incorrect',
        StatusCodes.BAD_REQUEST,
      );
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    sendSuccess(
      res,
      null,
      'Password changed successfully. Please log in again.',
    );
  } catch (err) {
    next(err);
  }
};
