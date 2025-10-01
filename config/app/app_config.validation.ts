import { AppConfig } from "./app_config";

export const validateConfig = () => {
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

    // Validate local storage configuration if using local storage
    if (AppConfig.STORAGE_DRIVER === 'local') {
        const localRequiredVars = [
            { key: 'LOCAL_STORAGE_PATH', value: AppConfig.LOCAL_STORAGE_PATH },
            { key: 'LOCAL_STORAGE_URL', value: AppConfig.LOCAL_STORAGE_URL },
        ];

        localRequiredVars.forEach(({ key, value }) => {
            if (!value || value.trim() === '') {
                errors.push(`${key} is required when using local storage driver`);
            }
        });
    }




    // Validate NODE_ENV
    if (AppConfig.NODE_ENV && !['development', 'production', 'test'].includes(AppConfig.NODE_ENV)) {
        errors.push('NODE_ENV must be one of: development, production, test');
    }

    // Throw error if validation fails
    if (errors.length > 0) {
        console.error('❌ Configuration validation failed:');
        errors.forEach(error => console.error(`   - ${error}`));
        throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }

    console.log('✅ Configuration validation passed');
};
