// FILE: backend/src/controllers/bookings.controller.ts

import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/apiResponse';
import { getPaginationParams, buildPaginationMeta } from '../utils/pagination';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const createBookingSchema = z.object({
  carId: z.string().min(1),
  pickupDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), 'Invalid pickup date'),
  returnDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), 'Invalid return date'),
  pickupLocation: z.string().min(1),
  returnLocation: z.string().min(1),
  insuranceIncluded: z.boolean().optional().default(false),
  gpsIncluded: z.boolean().optional().default(false),
  childSeatIncluded: z.boolean().optional().default(false),
  notes: z.string().optional(),
});

const INSURANCE_COST_PER_DAY = 3000;
const GPS_COST_PER_DAY = 1500;
const CHILD_SEAT_COST_PER_DAY = 1000;

export const getBookings = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page,
      req.query.limit,
    );
    const { status, paymentStatus, search } = req.query;

    const where: Prisma.BookingWhereInput = {};

    if (req.user!.role === 'CUSTOMER') {
      where.userId = req.user!.id;
    }

    if (status) where.status = status as Prisma.EnumBookingStatusFilter;
    if (paymentStatus)
      where.paymentStatus = paymentStatus as Prisma.EnumPaymentStatusFilter;

    if (search) {
      where.OR = [
        { id: { contains: String(search), mode: 'insensitive' } },
        { user: { email: { contains: String(search), mode: 'insensitive' } } },
        {
          user: {
            firstName: { contains: String(search), mode: 'insensitive' },
          },
        },
        { car: { make: { contains: String(search), mode: 'insensitive' } } },
        { car: { model: { contains: String(search), mode: 'insensitive' } } },
      ];
    }

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
          car: {
            select: {
              id: true,
              make: true,
              model: true,
              year: true,
              category: true,
              images: true,
              licensePlate: true,
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

export const getBookingById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
            driverLicense: true,
          },
        },
        car: true,
        payments: true,
      },
    });

    if (!booking)
      throw new AppError('Booking not found', StatusCodes.NOT_FOUND);

    if (req.user!.role === 'CUSTOMER' && booking.userId !== req.user!.id) {
      throw new AppError('Access denied', StatusCodes.FORBIDDEN);
    }

    sendSuccess(res, booking);
  } catch (err) {
    next(err);
  }
};

export const createBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = createBookingSchema.parse(req.body);

    const pickupDate = new Date(data.pickupDate);
    const returnDate = new Date(data.returnDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (pickupDate < now) {
      throw new AppError(
        'Pickup date cannot be in the past',
        StatusCodes.BAD_REQUEST,
      );
    }

    if (returnDate <= pickupDate) {
      throw new AppError(
        'Return date must be after pickup date',
        StatusCodes.BAD_REQUEST,
      );
    }

    const car = await prisma.car.findUnique({ where: { id: data.carId } });
    if (!car) throw new AppError('Car not found', StatusCodes.NOT_FOUND);
    if (car.status !== 'AVAILABLE') {
      throw new AppError(
        'Car is not available for booking',
        StatusCodes.BAD_REQUEST,
      );
    }

    const conflicting = await prisma.booking.findFirst({
      where: {
        carId: data.carId,
        status: { in: ['CONFIRMED', 'ACTIVE', 'PENDING'] },
        AND: [
          { pickupDate: { lt: returnDate } },
          { returnDate: { gt: pickupDate } },
        ],
      },
    });

    if (conflicting) {
      throw new AppError(
        'Car is not available for the selected dates',
        StatusCodes.CONFLICT,
      );
    }

    const totalDays = Math.ceil(
      (returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const dailyRate = Number(car.pricePerDay);
    const insuranceCost = data.insuranceIncluded
      ? INSURANCE_COST_PER_DAY * totalDays
      : 0;
    const gpsCost = data.gpsIncluded ? GPS_COST_PER_DAY * totalDays : 0;
    const childSeatCost = data.childSeatIncluded
      ? CHILD_SEAT_COST_PER_DAY * totalDays
      : 0;

    const baseTotal =
      totalDays >= 7
        ? Number(car.pricePerWeek) * Math.floor(totalDays / 7) * 7 +
          dailyRate * (totalDays % 7)
        : dailyRate * totalDays;

    const subtotal = baseTotal + insuranceCost + gpsCost + childSeatCost;
    const discount = 0;
    const totalAmount = subtotal - discount;

    const booking = await prisma.booking.create({
      data: {
        userId: req.user!.id,
        carId: data.carId,
        pickupDate,
        returnDate,
        pickupLocation: data.pickupLocation,
        returnLocation: data.returnLocation,
        totalDays,
        dailyRate,
        insuranceIncluded: data.insuranceIncluded,
        gpsIncluded: data.gpsIncluded,
        childSeatIncluded: data.childSeatIncluded,
        insuranceCost,
        gpsCost,
        childSeatCost,
        subtotal,
        discount,
        totalAmount,
        notes: data.notes,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
      },
      include: {
        car: { select: { make: true, model: true, year: true, images: true } },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    await prisma.notification.create({
      data: {
        userId: req.user!.id,
        title: 'Booking Created',
        message: `Your booking for ${car.make} ${car.model} has been submitted. Reference: ${booking.id.slice(-8).toUpperCase()}`,
        type: 'SUCCESS',
      },
    });

    sendCreated(res, booking, 'Booking created successfully');
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { status, paymentStatus, paymentReference } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { car: true, user: true },
    });

    if (!booking)
      throw new AppError('Booking not found', StatusCodes.NOT_FOUND);

    const updateData: Prisma.BookingUpdateInput = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (paymentReference) updateData.paymentReference = paymentReference;

    if (status === 'ACTIVE') {
      await prisma.car.update({
        where: { id: booking.carId },
        data: { status: 'RENTED' },
      });
    }

    if (status === 'COMPLETED' || status === 'CANCELLED') {
      await prisma.car.update({
        where: { id: booking.carId },
        data: { status: 'AVAILABLE' },
      });
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        car: { select: { make: true, model: true } },
        user: { select: { firstName: true, email: true } },
      },
    });

    await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: 'Booking Updated',
        message: `Your booking status has been updated to: ${status || booking.status}`,
        type: 'INFO',
      },
    });

    sendSuccess(res, updated, 'Booking status updated');
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { cancellationReason } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
    });
    if (!booking)
      throw new AppError('Booking not found', StatusCodes.NOT_FOUND);

    if (req.user!.role === 'CUSTOMER' && booking.userId !== req.user!.id) {
      throw new AppError('Access denied', StatusCodes.FORBIDDEN);
    }

    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      throw new AppError(
        'Only pending or confirmed bookings can be cancelled',
        StatusCodes.BAD_REQUEST,
      );
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        status: 'CANCELLED',
        paymentStatus: booking.paymentStatus === 'PAID' ? 'REFUNDED' : 'UNPAID',
        cancellationReason: cancellationReason || 'Cancelled by user',
      },
    });

    await prisma.car.update({
      where: { id: booking.carId },
      data: { status: 'AVAILABLE' },
    });

    await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: 'Booking Cancelled',
        message: `Your booking has been cancelled. ${booking.paymentStatus === 'PAID' ? 'A refund will be processed.' : ''}`,
        type: 'WARNING',
      },
    });

    sendSuccess(res, updated, 'Booking cancelled successfully');
  } catch (err) {
    next(err);
  }
};

export const getBookingStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const [statusCounts, monthlyRevenue] = await Promise.all([
      prisma.booking.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.$queryRaw<{ month: string; revenue: number; count: number }[]>`
        SELECT
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') as month,
          SUM("totalAmount")::float as revenue,
          COUNT(*)::int as count
        FROM bookings
        WHERE "createdAt" >= NOW() - INTERVAL '12 months'
          AND status != 'CANCELLED'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY DATE_TRUNC('month', "createdAt") ASC
      `,
    ]);

    sendSuccess(res, { statusCounts, monthlyRevenue });
  } catch (err) {
    next(err);
  }
};
