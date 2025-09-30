import request from 'supertest';
import { IUser } from '../../../models/user/user';
import { UserCrud } from '../../../models/user/user.cruds';
import { TestHelpers } from '../../utils/testHelpers';
import { generateToken } from '../../../utils/jwt';
import app from '../../../app';

describe('Mini Profile API Integration Tests', () => {
  let testAdmin: IUser;
  let testCustomer: IUser;
  let adminToken: string;
  let customerToken: string;

  const apiBaseUrl = '/general/mini-profile';

  beforeEach(async () => {
    jest.clearAllMocks();
    // Create test users
    testAdmin = await TestHelpers.createTestAdmin({
      full_name: 'Test Admin User',
      avatar: 'https://example.com/admin-avatar.jpg',
    });

    testCustomer = await TestHelpers.createTestCustomer({
      full_name: 'Test Customer User',
      avatar: 'https://example.com/customer-avatar.jpg',
    });

    // Generate auth tokens
    adminToken = generateToken(testAdmin);
    customerToken = generateToken(testCustomer);
  });

  describe(`GET ${apiBaseUrl}/admin`, () => {
    it('should return admin user mini profile for authenticated admin (header token)', async () => {
      const response = await request(app)
        .get(`${apiBaseUrl}/admin`)
        .set('access_token', adminToken)
        .expect(200);

      expect(response.body).toEqual({
        _id: testAdmin?._id?.toString(),
        full_name: 'Test Admin User',
        avatar: 'https://example.com/admin-avatar.jpg',
      });
    });

    it('should return admin user mini profile for authenticated admin (cookie token)', async () => {
      const response = await request(app)
        .get(`${apiBaseUrl}/admin`)
        .set('Cookie', [`access_token=${adminToken}`]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: testAdmin?._id?.toString(),
        full_name: 'Test Admin User',
        avatar: 'https://example.com/admin-avatar.jpg',
      });
    });

    it('should return 401 for unauthenticated request', async () => {
      await request(app).get(`${apiBaseUrl}/admin`).expect(401);
    });

    it('should return 401 for invalid token', async () => {
      await request(app)
        .get(`${apiBaseUrl}/admin`)
        .set('access_token', 'invalid-token')
        .expect(401);
    });

    it('should return 403 for customer trying to access admin endpoint', async () => {
      await request(app).get(`${apiBaseUrl}/admin`).set('access_token', customerToken).expect(403);
    });

    it('should return 403 when admin user is deleted', async () => {
      // Delete the user
      // await UserCrud.deleteById(testAdmin?._id?.toString() || "");

      const tempAdmin = await TestHelpers.createTestAdmin({
        full_name: 'Test Admin User',
        avatar: 'https://example.com/admin-avatar.jpg',
      });

      const tempAdminToken = generateToken(tempAdmin);

      await UserCrud.deleteById(tempAdmin?._id?.toString() || '');

      const response = await request(app)
        .get(`${apiBaseUrl}/admin`)
        .set('access_token', tempAdminToken);
      expect(response.status).toBe(403);
    });

    it('should handle admin user without avatar', async () => {
      // Create admin without avatar
      const adminWithoutAvatar = await TestHelpers.createTestAdmin({
        full_name: 'Admin No Avatar',
        avatar: undefined,
      });
      const tokenWithoutAvatar = generateToken(adminWithoutAvatar);

      const response = await request(app)
        .get(`${apiBaseUrl}/admin`)
        .set('access_token', tokenWithoutAvatar)
        .expect(200);

      expect(response.body).toEqual({
        _id: adminWithoutAvatar?._id?.toString(),
        full_name: 'Admin No Avatar',
        avatar: null,
      });
    });
  });

  describe(`GET ${apiBaseUrl}/customer`, () => {
    it('should return customer user mini profile for authenticated customer (header token)', async () => {
      const response = await request(app)
        .get(`${apiBaseUrl}/customer`)
        .set('access_token', customerToken)
        .expect(200);

      expect(response.body).toEqual({
        _id: testCustomer?._id?.toString(),
        full_name: 'Test Customer User',
        avatar: 'https://example.com/customer-avatar.jpg',
      });
    });

    it('should return customer user mini profile for authenticated customer (cookie token)', async () => {
      const response = await request(app)
        .get(`${apiBaseUrl}/customer`)
        .set('Cookie', [`access_token=${customerToken}`])
        .expect(200);

      expect(response.body).toEqual({
        _id: testCustomer?._id?.toString(),
        full_name: 'Test Customer User',
        avatar: 'https://example.com/customer-avatar.jpg',
      });
    });

    it('should return 401 for unauthenticated request', async () => {
      await request(app).get(`${apiBaseUrl}/customer`).expect(401);
    });

    it('should return 403 for admin trying to access customer endpoint', async () => {
      await request(app).get(`${apiBaseUrl}/customer`).set('access_token', adminToken).expect(403);
    });

    it('should return 403 when customer user is deleted', async () => {
      // Delete the user
      const tempAdmin = await TestHelpers.createTestAdmin({
        full_name: 'Test Admin User',
        avatar: 'https://example.com/admin-avatar.jpg',
      });

      const tempAdminToken = generateToken(tempAdmin);

      await UserCrud.deleteById(tempAdmin?._id?.toString() || '');

      await request(app)
        .get(`${apiBaseUrl}/customer`)
        .set('access_token', tempAdminToken)
        .expect(403);
    });

    it('should handle expired token', async () => {
      await request(app)
        .get(`${apiBaseUrl}/customer`)
        .set('access_token', 'expired.token.here')
        .expect(401);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Mock UserCrud.findById to throw an error
      const originalFindById = UserCrud.tryFindById;
      jest
        .spyOn(UserCrud, 'tryFindById')
        .mockRejectedValue(new Error('Database connection failed'));

      await request(app).get(`${apiBaseUrl}/admin`).set('access_token', adminToken).expect(500);

      // Restore original method
      UserCrud.tryFindById = originalFindById;
    });

    it('should return proper error message for user not found', async () => {
      // Create a token for a non-existent user
      const fakeUser = {
        _id: '507f1f77bcf86cd799439999', // Non-existent ID
      } as any;
      const fakeToken = generateToken(fakeUser);

      const response = await request(app)
        .get(`${apiBaseUrl}/admin`)
        .set('access_token', fakeToken)
        .expect(403);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Response Format Validation', () => {
    it('should return response with correct content-type header', async () => {
      const response = await request(app)
        .get(`${apiBaseUrl}/admin`)
        .set('access_token', adminToken)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('full_name');
      expect(response.body).toHaveProperty('avatar');
    });

    it('should ensure _id is returned as string', async () => {
      const response = await request(app)
        .get(`${apiBaseUrl}/customer`)
        .set('access_token', customerToken)
        .expect(200);

      expect(typeof response.body._id).toBe('string');
    });

    it('should not expose sensitive user data', async () => {
      const response = await request(app)
        .get(`${apiBaseUrl}/admin`)
        .set('access_token', adminToken)
        .expect(200);

      // Ensure sensitive fields are not returned
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('email');
      expect(response.body).not.toHaveProperty('role');
      expect(response.body).not.toHaveProperty('created_at');
      expect(response.body).not.toHaveProperty('updated_at');
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle concurrent requests to admin endpoint', async () => {
      const requests = Array(5)
        .fill(null)
        .map(() =>
          request(app).get(`${apiBaseUrl}/admin`).set('access_token', adminToken).expect(200)
        );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.body._id).toBe(testAdmin?._id?.toString());
      });
    });

    it('should handle concurrent requests to customer endpoint', async () => {
      const requests = Array(5)
        .fill(null)
        .map(() =>
          request(app).get(`${apiBaseUrl}/customer`).set('access_token', customerToken).expect(200)
        );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.body._id).toBe(testCustomer?._id?.toString());
      });
    });

    it('should handle user with very long full_name', async () => {
      const longName = 'A'.repeat(500); // Very long name
      const userWithLongName = await TestHelpers.createTestAdmin({
        full_name: longName,
      });
      const tokenLongName = generateToken(userWithLongName);

      const response = await request(app)
        .get(`${apiBaseUrl}/admin`)
        .set('access_token', tokenLongName)
        .expect(200);

      expect(response.body.full_name).toBe(longName);
    });
  });
});
