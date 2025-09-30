import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface IAppConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  APP_URL: string;
  SERVER_URL: string;
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  SMTP_URL: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASSWORD: string;

  STORAGE_DRIVER: 's3' | 'local';

  AWS_S3_BUCKET: string;
  AWS_S3_PUBLIC: string;
  AWS_S3_SECRET: string;
  AWS_S3_REGION: string;

  LOCAL_STORAGE_PATH: string;
  LOCAL_STORAGE_URL: string;

  APPLE_CLIENT_ID: string;
  APPLE_TEAM_ID: string;
  APPLE_KEY_ID: string;
  APPLE_PRIVATE_KEY: string; // Content of the .p8 file

  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

export const AppConfig: IAppConfig = {
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:8000',
  PORT: parseInt(process.env.PORT || '8000', 10),
  MONGO_URI:
    process.env.MONGO_URI ||
    `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mongo:27017/${process.env.MONGO_DATABASE}`,
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret', // Update with a secure value if not provided
  SMTP_URL: process.env.SMTP_URL || 'smtp.yandex.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '465', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',

  STORAGE_DRIVER: (process.env.STORAGE_DRIVER as 's3' | 'local') || 'local',

  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || '',
  AWS_S3_PUBLIC: process.env.AWS_S3_PUBLIC || '',
  AWS_S3_SECRET: process.env.AWS_S3_SECRET || '',
  AWS_S3_REGION: process.env.AWS_S3_REGION || '',

  LOCAL_STORAGE_PATH: process.env.LOCAL_STORAGE_PATH || 'public',
  LOCAL_STORAGE_URL: process.env.LOCAL_STORAGE_URL || '/public',

  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID || '',
  APPLE_TEAM_ID: process.env.APPLE_TEAM_ID || '',
  APPLE_KEY_ID: process.env.APPLE_KEY_ID || '',
  APPLE_PRIVATE_KEY: process.env.APPLE_PRIVATE_KEY || '', // Content of the .p8 file

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
};

// Enhanced validation to ensure required variables are set
const validateConfig = () => {
  const errors: string[] = [];

  // Required environment variables
  const requiredEnvVars = [
    { key: 'APP_URL', value: AppConfig.APP_URL },
    { key: 'MONGO_URI', value: AppConfig.MONGO_URI },
    { key: 'JWT_SECRET', value: AppConfig.JWT_SECRET },
  ];

  // Check required variables
  requiredEnvVars.forEach(({ key, value }) => {
    if (!value || value.trim() === '') {
      errors.push(`${key} is required but not set`);
    }
  });

  // Validate JWT secret strength
  if (AppConfig.JWT_SECRET && AppConfig.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET should be at least 32 characters long for security');
  }

  // Validate PORT
  if (isNaN(AppConfig.PORT) || AppConfig.PORT < 1 || AppConfig.PORT > 65535) {
    errors.push('PORT must be a valid number between 1 and 65535');
  }

  // Validate MONGO_URI format
  if (
    AppConfig.MONGO_URI &&
    !AppConfig.MONGO_URI.startsWith('mongodb://') &&
    !AppConfig.MONGO_URI.startsWith('mongodb+srv://')
  ) {
    errors.push('MONGO_URI must start with mongodb:// or mongodb+srv://');
  }

  // Validate storage driver
  if (AppConfig.STORAGE_DRIVER && !['s3', 'local'].includes(AppConfig.STORAGE_DRIVER)) {
    errors.push('STORAGE_DRIVER must be either "s3" or "local"');
  }

  // Validate S3 configuration if using S3 storage
  if (AppConfig.STORAGE_DRIVER === 's3') {
    const s3RequiredVars = [
      { key: 'AWS_S3_BUCKET', value: AppConfig.AWS_S3_BUCKET },
      { key: 'AWS_S3_PUBLIC', value: AppConfig.AWS_S3_PUBLIC },
      { key: 'AWS_S3_SECRET', value: AppConfig.AWS_S3_SECRET },
      { key: 'AWS_S3_REGION', value: AppConfig.AWS_S3_REGION },
    ];

    s3RequiredVars.forEach(({ key, value }) => {
      if (!value || value.trim() === '') {
        errors.push(`${key} is required when using S3 storage driver`);
      }
    });
  }

  // Validate NODE_ENV
  if (AppConfig.NODE_ENV && !['development', 'production', 'test'].includes(AppConfig.NODE_ENV)) {
    errors.push('NODE_ENV must be one of: development, production, test');
  }

  // Log warnings for development mode
  if (AppConfig.NODE_ENV === 'development') {
    if (AppConfig.JWT_SECRET === 'default_jwt_secret') {
      console.warn(
        '⚠️  WARNING: Using default JWT_SECRET in development mode. Change this for production!'
      );
    }
  }

  // Throw error if validation fails
  if (errors.length > 0) {
    console.error('❌ Configuration validation failed:');
    errors.forEach(error => console.error(`   - ${error}`));
    throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
  }

  console.log('✅ Configuration validation passed');
};

// Run validation
validateConfig();
