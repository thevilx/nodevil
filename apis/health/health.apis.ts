import { Router } from 'express';
import { getHealthCheck, getReadyCheck } from '../../controllers/health/health.controllers';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Get application health status
 *     description: Returns basic health information about the application
 *     responses:
 *       200:
 *         description: Application is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *       503:
 *         description: Application is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/health', getHealthCheck);

/**
 * @swagger
 * /ready:
 *   get:
 *     tags: [Health]
 *     summary: Get application readiness status
 *     description: Returns readiness status including database connectivity
 *     responses:
 *       200:
 *         description: Application is ready to serve requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReadinessCheck'
 *       503:
 *         description: Application is not ready
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/ready', getReadyCheck);

export default router;
