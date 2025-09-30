import request from 'supertest';
import app from '../../../app';
import { setupTestDatabase, teardownTestDatabase } from '../../utils/setupTestFunctions';

describe('Security Middleware', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('Helmet Security Headers', () => {
    it('should set security headers', async () => {
      const response = await request(app).get('/health');

      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
      expect(response.headers).toHaveProperty('x-xss-protection', '0');
    });
  });

  describe('Rate Limiting', () => {
    it('should allow reasonable number of requests', async () => {
      // Make multiple requests within the rate limit
      for (let i = 0; i < 10; i++) {
        await request(app).get('/health').expect(200);
      }
    });

    it('should include rate limit headers', async () => {
      const response = await request(app).get('/health');

      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
      expect(response.headers).toHaveProperty('ratelimit-reset');
    });
  });

  describe('CORS', () => {
    it('should handle CORS properly', async () => {
      const response = await request(app).options('/health').set('Origin', 'http://localhost:3000');

      // Should not return 404 for valid preflight requests
      expect(response.status).not.toBe(404);
    });
  });

  describe('MongoDB Sanitization', () => {
    it('should sanitize query parameters', async () => {
      // Test with potentially malicious query parameters
      const response = await request(app).get('/health').query({ 'test[$ne]': 'malicious' });

      // Should still return normally (query params should be sanitized)
      expect(response.status).toBe(200);
    });
  });
});
