// FILE: backend/src/server.ts

import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './lib/prisma';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 DriveEase API running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();

const express = require('express');
const app = express();

// Add this line
app.set('trust proxy', 1);

// Your rate limiter and routes follow...
