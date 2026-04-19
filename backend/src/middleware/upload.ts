// FILE: backend/src/middleware/upload.ts

import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const carImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req: Request, file: Express.Multer.File) => {
    return {
      folder: 'driveease/cars',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 1200, height: 800, crop: 'fill', quality: 'auto' },
      ],
      public_id: `car_${Date.now()}_${file.originalname.split('.')[0]}`,
    };
  },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req: Request, file: Express.Multer.File) => {
    return {
      folder: 'driveease/avatars',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 400, height: 400, crop: 'fill', quality: 'auto' },
      ],
      public_id: `avatar_${Date.now()}_${file.originalname.split('.')[0]}`,
    };
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
};

export const uploadCarImages = multer({
  storage: carImageStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
});

export { cloudinary };
