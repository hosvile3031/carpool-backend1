const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Carpool Backend API');
      expect(response.body).toHaveProperty('version', '2.0.0');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message', 'Carpool Backend is running');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should validate user registration fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
          phone: '1234567890',
          password: '123',
          dateOfBirth: '1990-01-01',
          gender: 'male'
        })
        .expect(400);

      // Should return validation errors
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/rides', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/rides')
        .expect(401);

      // The actual response format from auth middleware
      expect(response.body).toHaveProperty('message', 'Access Denied');
    });
  });
});
