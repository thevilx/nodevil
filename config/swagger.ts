import swaggerJSDoc from 'swagger-jsdoc';
import { AppConfig } from './app_config';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Server App API',
      version: '1.0.0',
      description: 'A comprehensive Express.js server with MongoDB integration',
      contact: {
        name: 'Ideallco',
        email: 'contact@ideallco.com',
      },
    },
    servers: [
      {
        url: AppConfig.SERVER_URL,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            uptime: {
              type: 'number',
              description: 'Process uptime in seconds',
            },
            environment: {
              type: 'string',
              example: 'development',
            },
            version: {
              type: 'string',
              example: '1.0.0',
            },
            memory: {
              type: 'object',
              properties: {
                used: {
                  type: 'number',
                  description: 'Used memory in MB',
                },
                total: {
                  type: 'number',
                  description: 'Total memory in MB',
                },
              },
            },
          },
        },
        ReadinessCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'READY',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            checks: {
              type: 'object',
              properties: {
                database: {
                  type: 'string',
                  example: 'OK',
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./apis/**/*.ts', './controllers/**/*.ts'],
};

const specs = swaggerJSDoc(options);

export default specs;
