// FILE: backend/src/utils/jwt.ts

import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';
import { StatusCodes } from 'http-status-codes';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface RefreshPayload {
  userId: string;
  tokenId: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    } as jwt.SignOptions,
  );
};

export const generateRefreshToken = (payload: RefreshPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    } as jwt.SignOptions,
  );
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
  } catch {
    throw new AppError(
      'Invalid or expired access token',
      StatusCodes.UNAUTHORIZED,
    );
  }
};

export const verifyRefreshToken = (token: string): RefreshPayload => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string,
    ) as RefreshPayload;
  } catch {
    throw new AppError(
      'Invalid or expired refresh token',
      StatusCodes.UNAUTHORIZED,
    );
  }
};

export const generateTokenPair = (
  userId: string,
  email: string,
  role: string,
): { accessToken: string; refreshToken: string; tokenId: string } => {
  const tokenId = `${userId}_${Date.now()}`;
  const accessToken = generateAccessToken({ userId, email, role });
  const refreshToken = generateRefreshToken({ userId, tokenId });
  return { accessToken, refreshToken, tokenId };
};
