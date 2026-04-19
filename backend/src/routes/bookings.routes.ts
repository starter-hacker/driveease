// FILE: backend/src/routes/bookings.routes.ts

import { Router } from 'express';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking,
  getBookingStats,
} from '../controllers/bookings.controller';
import { authenticate, requireAdminOrStaff } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getBookings);
router.get('/stats', authenticate, requireAdminOrStaff, getBookingStats);
router.get('/:id', authenticate, getBookingById);
router.post('/', authenticate, createBooking);
router.patch(
  '/:id/status',
  authenticate,
  requireAdminOrStaff,
  updateBookingStatus,
);
router.patch('/:id/cancel', authenticate, cancelBooking);

export default router;
