// FILE: backend/src/routes/users.routes.ts

import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserBookingHistory,
  getUserStats,
} from '../controllers/users.controller';
import {
  authenticate,
  requireAdmin,
  requireAdminOrStaff,
} from '../middleware/auth';

const router = Router();

router.get('/', authenticate, requireAdminOrStaff, getUsers);
router.get('/:id', authenticate, getUserById);
router.get('/:id/bookings', authenticate, getUserBookingHistory);
router.get('/:id/stats', authenticate, getUserStats);
router.patch('/:id', authenticate, requireAdmin, updateUser);
router.delete('/:id', authenticate, requireAdmin, deleteUser);

export default router;
