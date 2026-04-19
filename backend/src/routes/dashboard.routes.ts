// FILE: backend/src/routes/dashboard.routes.ts

import { Router } from 'express';
import {
  getOverviewStats,
  getRevenueChart,
  getBookingTrends,
  getFleetBreakdown,
  getRecentActivity,
  getTopCars,
} from '../controllers/dashboard.controller';
import { authenticate, requireAdminOrStaff } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireAdminOrStaff);

router.get('/overview', getOverviewStats);
router.get('/revenue', getRevenueChart);
router.get('/trends', getBookingTrends);
router.get('/fleet', getFleetBreakdown);
router.get('/activity', getRecentActivity);
router.get('/top-cars', getTopCars);

export default router;
