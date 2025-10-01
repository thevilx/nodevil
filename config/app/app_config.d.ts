
export interface IAppConfig {
    NODE_ENV: 'development' | 'production' | 'test';
    iS_PRODUCTION?: boolean;
    APP_URL: string;
    SERVER_URL?: string;
    PORT: number;
    MONGO_URI: string;
    JWT_SECRET?: string;
    SMTP_URL?: string;
    SMTP_PORT?: number;
    SMTP_USER?: string;
    SMTP_PASSWORD?: string;
    STORAGE_DRIVER: 's3' | 'local';
    AWS_S3_BUCKET?: string;
    AWS_S3_PUBLIC?: string;
    AWS_S3_SECRET?: string;
    AWS_S3_REGION?: string;
    LOCAL_STORAGE_PATH?: string;
    LOCAL_STORAGE_URL?: string;
    APPLE_CLIENT_ID?: string;
    APPLE_TEAM_ID?: string;
    APPLE_KEY_ID?: string;
    APPLE_PRIVATE_KEY?: string; // Content of the .p8 file
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
}