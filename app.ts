import path from 'path';
import cookieParser from 'cookie-parser';
import limiter from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import appCors from './config/cors.config';
import apiRouter from './apis/index.api';
import express from 'express';
import appErrorHandler from './middlewares/error_handler.middleware';
import i18nMiddleware from './middlewares/i18n.middleware';
import { AppConfig } from './config/app/app_config';
import logger from './config/logger';
import swaggerSpecs from './config/swagger';
import { validateConfig } from './config/app/app_config.validation';
import { UnExpectedError } from './utils/errors';

const app = express();

// validate env variables config
validateConfig()

// Security middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'deny' },
  })
);

// Data sanitization against NoSQL query injection

// HTTP request logger middleware
if (AppConfig.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (message: string) => logger.info(message.trim()) },
    })
  );
}

// apply app cors setting
app.use(appCors);

app.use(
  limiter({
    windowMs: 60 * 60 * 1000,
    max: 2000,
    message: 'You exceeded 2000 requests in 1 hours limit!',
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(cookieParser());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve local uploads if using local storage driver
if (AppConfig.STORAGE_DRIVER === 'local') {
  if (!AppConfig.LOCAL_STORAGE_PATH || !AppConfig.LOCAL_STORAGE_URL) {
    throw new UnExpectedError('Local storage is not properly configured');
  }
  app.use(AppConfig.LOCAL_STORAGE_URL, express.static(path.resolve(AppConfig.LOCAL_STORAGE_PATH)));
}

// handle set language based on the cookie or header info
app.use(i18nMiddleware);

// Swagger documentation
if (!AppConfig.iS_PRODUCTION) {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'API Documentation',
    })
  );
}

// handle routes
app.use(apiRouter);

// handle errors by system or throw 500 error
app.use(appErrorHandler);

export default app;
