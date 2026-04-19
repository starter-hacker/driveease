// FILE: backend/src/routes/auth.routes.ts

import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { uploadAvatar } from '../middleware/upload';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.patch(
  '/profile',
  authenticate,
  uploadAvatar.single('avatar'),
  updateProfile,
);
router.patch('/change-password', authenticate, changePassword);

export default router;
