import { IAppConfig } from "./app_config.d";

export const AppConfig: IAppConfig = {
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    iS_PRODUCTION: process.env.NODE_ENV === 'production',
    APP_URL: process.env.APP_URL || 'http://localhost:3000',
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:8000',
    PORT: parseInt(process.env.PORT || '8000', 10),
    MONGO_URI: process.env.MONGO_URI || "", // Update with a secure value if not provided
    JWT_SECRET: process.env.JWT_SECRET, // Update with a secure value if not provided

    SMTP_URL: process.env.SMTP_URL || 'smtp.yandex.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '465', 10),
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',

    STORAGE_DRIVER: (process.env.STORAGE_DRIVER as 's3' | 'local') || 'local',

    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    AWS_S3_PUBLIC: process.env.AWS_S3_PUBLIC,
    AWS_S3_SECRET: process.env.AWS_S3_SECRET,
    AWS_S3_REGION: process.env.AWS_S3_REGION,

    LOCAL_STORAGE_PATH: process.env.LOCAL_STORAGE_PATH || 'public',
    LOCAL_STORAGE_URL: process.env.LOCAL_STORAGE_URL || '/public',

    APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
    APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
    APPLE_KEY_ID: process.env.APPLE_KEY_ID,
    APPLE_PRIVATE_KEY: process.env.APPLE_PRIVATE_KEY, // Content of the .p8 file

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

};