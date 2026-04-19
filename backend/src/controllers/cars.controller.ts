// FILE: backend/src/controllers/cars.controller.ts

import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/apiResponse';
import { getPaginationParams, buildPaginationMeta } from '../utils/pagination';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const carCreateSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z
    .number()
    .int()
    .min(1990)
    .max(new Date().getFullYear() + 1),
  category: z.enum(['ECONOMY', 'COMPACT', 'SUV', 'LUXURY', 'VAN', 'ELECTRIC']),
  pricePerDay: z.number().positive(),
  pricePerWeek: z.number().positive(),
  seats: z.number().int().min(2).max(15),
  transmission: z.enum(['AUTO', 'MANUAL']),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID']),
  mileage: z.number().int().min(0).optional(),
  color: z.string().min(1),
  features: z.array(z.string()).optional(),
  licensePlate: z.string().min(1),
  vin: z.string().min(1),
  description: z.string().optional(),
});

export const getCars = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page,
      req.query.limit,
    );
    const {
      category,
      status,
      priceMin,
      priceMax,
      seats,
      transmission,
      fuelType,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const where: Prisma.CarWhereInput = {};

    if (category) where.category = category as Prisma.EnumCarCategoryFilter;
    if (status) where.status = status as Prisma.EnumCarStatusFilter;
    if (transmission)
      where.transmission = transmission as Prisma.EnumTransmissionFilter;
    if (fuelType) where.fuelType = fuelType as Prisma.EnumFuelTypeFilter;
    if (seats) where.seats = parseInt(String(seats));

    if (priceMin || priceMax) {
      where.pricePerDay = {};
      if (priceMin) where.pricePerDay.gte = parseFloat(String(priceMin));
      if (priceMax) where.pricePerDay.lte = parseFloat(String(priceMax));
    }

    if (search) {
      where.OR = [
        { make: { contains: String(search), mode: 'insensitive' } },
        { model: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const validSortFields = [
      'createdAt',
      'pricePerDay',
      'rating',
      'year',
      'make',
    ];
    const orderBy: Prisma.CarOrderByWithRelationInput =
      validSortFields.includes(String(sortBy))
        ? { [String(sortBy)]: sortOrder === 'asc' ? 'asc' : 'desc' }
        : { createdAt: 'desc' };

    const [total, cars] = await Promise.all([
      prisma.car.count({ where }),
      prisma.car.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          make: true,
          model: true,
          year: true,
          category: true,
          pricePerDay: true,
          pricePerWeek: true,
          seats: true,
          transmission: true,
          fuelType: true,
          color: true,
          images: true,
          status: true,
          features: true,
          rating: true,
          reviewCount: true,
          licensePlate: true,
          description: true,
          createdAt: true,
        },
      }),
    ]);

    sendPaginated(res, cars, buildPaginationMeta(total, page, limit));
  } catch (err) {
    next(err);
  }
};

export const getCarById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const car = await prisma.car.findUnique({
      where: { id: req.params.id },
      include: {
        _count: { select: { bookings: true } },
      },
    });

    if (!car) throw new AppError('Car not found', StatusCodes.NOT_FOUND);

    sendSuccess(res, car);
  } catch (err) {
    next(err);
  }
};

export const createCar = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = carCreateSchema.parse({
      ...req.body,
      year: parseInt(req.body.year),
      pricePerDay: parseFloat(req.body.pricePerDay),
      pricePerWeek: parseFloat(req.body.pricePerWeek),
      seats: parseInt(req.body.seats),
      mileage: req.body.mileage ? parseInt(req.body.mileage) : 0,
      features: req.body.features
        ? typeof req.body.features === 'string'
          ? JSON.parse(req.body.features)
          : req.body.features
        : [],
    });

    const imageUrls = req.files
      ? (req.files as Express.Multer.File[]).map(
          (f) => (f as Express.Multer.File & { path: string }).path,
        )
      : [];

    const car = await prisma.car.create({
      data: {
        ...data,
        images: imageUrls,
        features: data.features || [],
        pricePerDay: data.pricePerDay,
        pricePerWeek: data.pricePerWeek,
      },
    });

    sendCreated(res, car, 'Car added to fleet successfully');
  } catch (err) {
    next(err);
  }
};

export const updateCar = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const existing = await prisma.car.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError('Car not found', StatusCodes.NOT_FOUND);

    const updateSchema = carCreateSchema.partial();
    const data = updateSchema.parse({
      ...req.body,
      ...(req.body.year && { year: parseInt(req.body.year) }),
      ...(req.body.pricePerDay && {
        pricePerDay: parseFloat(req.body.pricePerDay),
      }),
      ...(req.body.pricePerWeek && {
        pricePerWeek: parseFloat(req.body.pricePerWeek),
      }),
      ...(req.body.seats && { seats: parseInt(req.body.seats) }),
      ...(req.body.features && {
        features:
          typeof req.body.features === 'string'
            ? JSON.parse(req.body.features)
            : req.body.features,
      }),
    });

    const car = await prisma.car.update({
      where: { id: req.params.id },
      data,
    });

    sendSuccess(res, car, 'Car updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteCar = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const existing = await prisma.car.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) throw new AppError('Car not found', StatusCodes.NOT_FOUND);

    if (existing.status === 'RENTED') {
      throw new AppError(
        'Cannot retire a car that is currently rented',
        StatusCodes.BAD_REQUEST,
      );
    }

    await prisma.car.update({
      where: { id: req.params.id },
      data: { status: 'RETIRED' },
    });

    sendSuccess(res, null, 'Car retired from fleet successfully');
  } catch (err) {
    next(err);
  }
};

export const uploadCarImages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const car = await prisma.car.findUnique({ where: { id: req.params.id } });
    if (!car) throw new AppError('Car not found', StatusCodes.NOT_FOUND);

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      throw new AppError('No images uploaded', StatusCodes.BAD_REQUEST);
    }

    const imageUrls = (req.files as Express.Multer.File[]).map(
      (f) => (f as Express.Multer.File & { path: string }).path,
    );

    const updatedCar = await prisma.car.update({
      where: { id: req.params.id },
      data: { images: { push: imageUrls } },
    });

    sendSuccess(
      res,
      { images: updatedCar.images },
      'Images uploaded successfully',
    );
  } catch (err) {
    next(err);
  }
};

export const getCarAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError(
        'startDate and endDate are required',
        StatusCodes.BAD_REQUEST,
      );
    }

    const start = new Date(String(startDate));
    const end = new Date(String(endDate));

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new AppError('Invalid date format', StatusCodes.BAD_REQUEST);
    }

    if (start >= end) {
      throw new AppError(
        'startDate must be before endDate',
        StatusCodes.BAD_REQUEST,
      );
    }

    const conflictingBookings = await prisma.booking.findMany({
      where: {
        carId: req.params.id,
        status: { in: ['CONFIRMED', 'ACTIVE', 'PENDING'] },
        AND: [{ pickupDate: { lt: end } }, { returnDate: { gt: start } }],
      },
      select: {
        pickupDate: true,
        returnDate: true,
        status: true,
      },
    });

    const isAvailable = conflictingBookings.length === 0;

    sendSuccess(res, {
      carId: req.params.id,
      requestedPeriod: { start, end },
      isAvailable,
      conflictingPeriods: conflictingBookings.map((b) => ({
        from: b.pickupDate,
        to: b.returnDate,
        status: b.status,
      })),
    });
  } catch (err) {
    next(err);
  }
};
