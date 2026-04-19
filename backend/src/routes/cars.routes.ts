// FILE: backend/src/routes/cars.routes.ts

import { Router } from 'express';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  uploadCarImages,
  getCarAvailability,
} from '../controllers/cars.controller';
import {
  authenticate,
  requireAdmin,
  requireAdminOrStaff,
} from '../middleware/auth';
import { uploadCarImages as uploadMiddleware } from '../middleware/upload';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', getCars);
router.get('/:id', getCarById);
router.get('/:id/availability', getCarAvailability);
router.post(
  '/',
  authenticate,
  requireAdmin,
  uploadMiddleware.array('images', 10),
  createCar,
);
router.post(
  '/:id/images',
  authenticate,
  requireAdminOrStaff,
  uploadLimiter,
  uploadMiddleware.array('images', 10),
  uploadCarImages,
);
router.patch('/:id', authenticate, requireAdminOrStaff, updateCar);
router.delete('/:id', authenticate, requireAdmin, deleteCar);

export default router;
