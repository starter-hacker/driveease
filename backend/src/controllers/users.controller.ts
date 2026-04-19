// FILE: backend/src/controllers/users.controller.ts

import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import { getPaginationParams, buildPaginationMeta } from '../utils/pagination';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const pageParam =
      typeof req.query.page === 'string' ? req.query.page : undefined;

    const limitParam =
      typeof req.query.limit === 'string' ? req.query.limit : undefined;

    const { page, limit, skip } = getPaginationParams(pageParam, limitParam);
    const { search, role, loyaltyTier } = req.query;

    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role as Prisma.EnumRoleFilter;
    if (loyaltyTier)
      where.loyaltyTier = loyaltyTier as Prisma.EnumLoyaltyTierFilter;

    if (search) {
      where.OR = [
        { firstName: { contains: String(search), mode: 'insensitive' } },
        { lastName: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
        { phone: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          avatar: true,
          role: true,
          loyaltyTier: true,
          isActive: true,
          createdAt: true,
          _count: { select: { bookings: true } },
        },
      }),
    ]);

    sendPaginated(res, users, buildPaginationMeta(total, page, limit));
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (req.user!.role === 'CUSTOMER' && req.params.id !== req.user!.id) {
      throw new AppError('Access denied', StatusCodes.FORBIDDEN);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
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

    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

    sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const schema = z.object({
      firstName: z.string().min(1).max(50).optional(),
      lastName: z.string().min(1).max(50).optional(),
      phone: z.string().optional(),
      role: z.enum(['ADMIN', 'STAFF', 'CUSTOMER']).optional(),
      loyaltyTier: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']).optional(),
      isActive: z.boolean().optional(),
    });

    const data = schema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        loyaltyTier: true,
        isActive: true,
      },
    });

    sendSuccess(res, user, 'User updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);

    if (req.params.id === req.user!.id) {
      throw new AppError(
        'Cannot deactivate your own account',
        StatusCodes.BAD_REQUEST,
      );
    }

    await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });

    sendSuccess(res, null, 'User deactivated successfully');
  } catch (err) {
    next(err);
  }
};

export const getUserBookingHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const pageParam =
      typeof req.query.page === 'string' ? req.query.page : undefined;

    const limitParam =
      typeof req.query.limit === 'string' ? req.query.limit : undefined;

    const { page, limit, skip } = getPaginationParams(pageParam, limitParam);

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where: { userId: req.params.id } }),
      prisma.booking.findMany({
        where: { userId: req.params.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          car: {
            select: {
              make: true,
              model: true,
              year: true,
              category: true,
              images: true,
            },
          },
        },
      }),
    ]);

    sendPaginated(res, bookings, buildPaginationMeta(total, page, limit));
  } catch (err) {
    next(err);
  }
};

export const getUserStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.params.id;

    const [bookingCounts, totalSpentResult] = await Promise.all([
      prisma.booking.groupBy({
        by: ['status'],
        where: { userId },
        _count: { status: true },
      }),
      prisma.booking.aggregate({
        where: { userId, status: { in: ['COMPLETED', 'ACTIVE'] } },
        _sum: { totalAmount: true },
      }),
    ]);

    const totalBookings = bookingCounts.reduce(
      (acc, b) => acc + b._count.status,
      0,
    );
    const completedBookings =
      bookingCounts.find((b) => b.status === 'COMPLETED')?._count.status || 0;
    const totalSpent = Number(totalSpentResult._sum.totalAmount || 0);

    let loyaltyTier = 'BRONZE';
    if (totalSpent >= 500000) loyaltyTier = 'PLATINUM';
    else if (totalSpent >= 200000) loyaltyTier = 'GOLD';
    else if (totalSpent >= 80000) loyaltyTier = 'SILVER';

    await prisma.user.update({
      where: { id: userId },
      data: {
        loyaltyTier: loyaltyTier as 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM',
      },
    });

    sendSuccess(res, {
      totalBookings,
      completedBookings,
      totalSpent,
      loyaltyTier,
      bookingCounts,
    });
  } catch (err) {
    next(err);
  }
};
