// FILE: backend/src/controllers/notifications.controller.ts

import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import { getPaginationParams, buildPaginationMeta } from '../utils/pagination';
import { AppError } from '../middleware/errorHandler';
import { StatusCodes } from 'http-status-codes';
import { AuthRequest } from '../middleware/auth';

export const getNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page,
      req.query.limit,
    );

    const where = { userId: req.user!.id };

    const [total, notifications] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    sendPaginated(res, notifications, buildPaginationMeta(total, page, limit));
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });

    if (!notification)
      throw new AppError('Notification not found', StatusCodes.NOT_FOUND);
    if (notification.userId !== req.user!.id) {
      throw new AppError('Access denied', StatusCodes.FORBIDDEN);
    }

    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });

    sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data: { isRead: true },
    });

    sendSuccess(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};

export const getUnreadCount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.user!.id, isRead: false },
    });

    sendSuccess(res, { count });
  } catch (err) {
    next(err);
  }
};
