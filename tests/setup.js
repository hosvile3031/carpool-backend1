// Set test environment
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/carpool_test';
process.env.JWT_SECRET = 'test-jwt-secret';

// Increase timeout for database operations
jest.setTimeout(10000);
