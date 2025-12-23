require('dotenv').config();
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
process.env.MONGO_URI = 'mongodb://localhost:27017/test-db';

// Additional global setup can be added here
const { createAuthMiddleware } = require('../../src/middleware/auth.middleware');

jest.mock('../../src/middleware/auth.middleware', () => {
  return {
    createAuthMiddleware: jest.fn(() => (req, res, next) => {
      req.user = { id: 'testUserId', role: 'seller' }; // Mocked user
      next();
    }),
  };
});
