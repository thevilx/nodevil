import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AppConfig } from '../../config/app/app_config';
import logger from '../../config/logger';

export const getHealthCheck = async (req: Request, res: Response): Promise<void> => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: AppConfig.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
    },
  };

  try {
    res.json(healthCheck);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
};

export const getReadyCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    const isDbConnected = dbState === 1; // 1 means connected

    if (!isDbConnected) {
      res.status(503).json({
        status: 'NOT_READY',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'FAILED',
        },
      });
      return;
    }

    // Perform a simple database query to ensure it's working
    await mongoose.connection.db?.admin().ping();

    res.status(200).json({
      status: 'READY',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'OK',
      },
    });
  } catch (error) {
    logger.error('Readiness check failed:', error);
    res.status(503).json({
      status: 'NOT_READY',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'FAILED',
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
