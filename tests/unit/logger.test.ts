import winston from 'winston';
import logger from '../../config/logger';

describe('Logger Configuration', () => {
  it('should be a Winston logger instance', () => {
    expect(logger).toBeInstanceOf(winston.Logger);
  });

  it('should have the correct log levels', () => {
    expect(logger.levels).toBeDefined();
  });

  it('should have transports configured', () => {
    expect(logger.transports).toBeDefined();
    expect(logger.transports.length).toBeGreaterThan(0);
  });

  it('should log messages without throwing errors', () => {
    expect(() => {
      logger.info('Test info message');
      logger.warn('Test warning message');
      logger.error('Test error message');
    }).not.toThrow();
  });

  it('should have correct service metadata', () => {
    expect(logger.defaultMeta).toHaveProperty('service', 'server-app');
  });
});
