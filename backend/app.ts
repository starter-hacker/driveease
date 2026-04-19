// FILE: backend/src/app.ts

// import 'express-async-errors';
// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import { generalLimiter } from './middleware/rateLimiter';
// import { errorHandler } from './middleware/errorHandler';
// import authRoutes from './routes/auth.routes';
// import carRoutes from './routes/cars.routes';
// import bookingRoutes from './routes/bookings.routes';
// import userRoutes from './routes/users.routes';
// import dashboardRoutes from './routes/dashboard.routes';
// import notificationRoutes from './routes/notifications.routes';

// const app = express();

// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: 'cross-origin' },
//   }),
// );

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
//     credentials: true,
//     methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   }),
// );

// app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(generalLimiter);

// app.get('/health', (_req, res) => {
//   res.json({
//     status: 'ok',
//     timestamp: new Date().toISOString(),
//     service: 'DriveEase API',
//   });
// });

// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/cars', carRoutes);
// app.use('/api/v1/bookings', bookingRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/dashboard', dashboardRoutes);
// app.use('/api/v1/notifications', notificationRoutes);

// app.use('*', (_req, res) => {
//   res.status(404).json({ success: false, message: 'Route not found' });
// });

// app.use(errorHandler);

// export default app;

// FILE: backend/src/app.ts

import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import carRoutes from './routes/cars.routes';
import bookingRoutes from './routes/bookings.routes';
import userRoutes from './routes/users.routes';
import dashboardRoutes from './routes/dashboard.routes';
import notificationRoutes from './routes/notifications.routes';

const app = express();

/**
 * ✅ IMPORTANT FIX FOR RAILWAY + PROXIES
 * This fixes:
 * ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
 */
app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(generalLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'DriveEase API',
  });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cars', carRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

export default app;
