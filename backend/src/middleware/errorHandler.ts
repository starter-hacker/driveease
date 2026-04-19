// FILE: backend/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = (err.meta?.target as string[])?.join(', ') || 'field';
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: `A record with this ${field} already exists`,
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Record not found',
      });
      return;
    }

    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Database operation failed',
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid data provided',
    });
    return;
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'An unexpected error occurred',
  });
};
