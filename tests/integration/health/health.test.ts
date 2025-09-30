import request from 'supertest';
import app from '../../../app';
import { setupTestDatabase, teardownTestDatabase } from '../../utils/setupTestFunctions';

describe('Health Endpoints', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('GET /health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('memory');
      expect(response.body.memory).toHaveProperty('used');
      expect(response.body.memory).toHaveProperty('total');
    });

    it('should return correct content type', async () => {
      await request(app).get('/health').expect(200).expect('Content-Type', /json/);
    });
  });

  describe('GET /ready', () => {
    it('should return 200 and readiness status when database is connected', async () => {
      const response = await request(app).get('/ready').expect(200);

      expect(response.body).toHaveProperty('status', 'READY');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('checks');
      expect(response.body.checks).toHaveProperty('database', 'OK');
    });

    it('should return correct content type', async () => {
      await request(app).get('/ready').expect(200).expect('Content-Type', /json/);
    });
  });
});
