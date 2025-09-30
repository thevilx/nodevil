import { AppConfig } from '../../config/app_config';

describe('Application Configuration', () => {
  it('should have required environment variables defined', () => {
    expect(AppConfig.NODE_ENV).toBeDefined();
    expect(['development', 'production', 'test']).toContain(AppConfig.NODE_ENV);
  });

  it('should have database configuration', () => {
    expect(AppConfig.MONGO_URI).toBeDefined();
  });

  it('should have server configuration', () => {
    expect(AppConfig.PORT).toBeDefined();
    expect(typeof AppConfig.PORT).toBe('number');
    expect(AppConfig.SERVER_URL).toBeDefined();
    expect(AppConfig.APP_URL).toBeDefined();
  });

  it('should have JWT secret defined', () => {
    expect(AppConfig.JWT_SECRET).toBeDefined();
    expect(AppConfig.JWT_SECRET.length).toBeGreaterThan(0);
  });

  it('should have storage driver configuration', () => {
    expect(AppConfig.STORAGE_DRIVER).toBeDefined();
    expect(['s3', 'local']).toContain(AppConfig.STORAGE_DRIVER);
  });

  it('should validate port is a valid number', () => {
    expect(AppConfig.PORT).toBeGreaterThan(0);
    expect(AppConfig.PORT).toBeLessThan(65536);
  });
});
