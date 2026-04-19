// FILE: backend/src/controllers/dashboard.controller.ts

import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';

export const getOverviewStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const [
      totalRevenue,
      activeRentals,
      availableCars,
      totalCustomers,
      totalCars,
      pendingBookings,
    ] = await Promise.all([
      prisma.booking.aggregate({
        where: { status: { in: ['COMPLETED', 'ACTIVE'] } },
        _sum: { totalAmount: true },
      }),
      prisma.booking.count({ where: { status: 'ACTIVE' } }),
      prisma.car.count({ where: { status: 'AVAILABLE' } }),
      prisma.user.count({ where: { role: 'CUSTOMER', isActive: true } }),
      prisma.car.count({ where: { status: { not: 'RETIRED' } } }),
      prisma.booking.count({ where: { status: 'PENDING' } }),
    ]);

    const fleetUtilization =
      totalCars > 0 ? Math.round((activeRentals / totalCars) * 100) : 0;

    sendSuccess(res, {
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      activeRentals,
      availableCars,
      totalCustomers,
      totalCars,
      pendingBookings,
      fleetUtilization,
    });
  } catch (err) {
    next(err);
  }
};

export const getRevenueChart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await prisma.$queryRaw;
    {
      month: string;
      revenue: number;
      bookings: number;
    }
    [] >
      `
      SELECT
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') as month,
        COALESCE(SUM("totalAmount"), 0)::float as revenue,
        COUNT(*)::int as bookings
      FROM bookings
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
        AND status IN ('COMPLETED', 'ACTIVE')
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt") ASC
    `;

    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};

export const getBookingTrends = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await prisma.$queryRaw;
    {
      week: string;
      bookings: number;
    }
    [] >
      `
      SELECT
        TO_CHAR(DATE_TRUNC('week', "createdAt"), 'DD Mon') as week,
        COUNT(*)::int as bookings
      FROM bookings
      WHERE "createdAt" >= NOW() - INTERVAL '8 weeks'
      GROUP BY DATE_TRUNC('week', "createdAt")
      ORDER BY DATE_TRUNC('week', "createdAt") ASC
    `;

    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};

export const getFleetBreakdown = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await prisma.car.groupBy({
      by: ['category'],
      where: { status: { not: 'RETIRED' } },
      _count: { category: true },
    });

    const formatted = data.map((item) => ({
      name: item.category,
      value: item._count.category,
    }));

    sendSuccess(res, formatted);
  } catch (err) {
    next(err);
  }
};

export const getRecentActivity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const bookings = await prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        car: { select: { make: true, model: true, year: true, images: true } },
      },
    });

    sendSuccess(res, bookings);
  } catch (err) {
    next(err);
  }
};

export const getTopCars = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await prisma.car.findMany({
      take: 5,
      orderBy: { bookings: { _count: 'desc' } },
      select: {
        id: true,
        make: true,
        model: true,
        year: true,
        category: true,
        images: true,
        pricePerDay: true,
        rating: true,
        _count: { select: { bookings: true } },
      },
    });

    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
};
