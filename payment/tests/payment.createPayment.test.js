const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const Razorpay = require('razorpay');

jest.mock('axios');
jest.mock('razorpay', () => {
    return jest.fn().mockImplementation(() => {
        return {
            orders: {
                create: jest.fn().mockResolvedValue({
                    id: 'order_123',
                    amount: 100,
                    currency: 'INR'
                })
            }
        };
    });
});

describe('POST /api/payments/create/:orderId', () => {
    const validUserToken = jwt.sign({ id: 'user123', role: 'user' }, process.env.JWT_SECRET);
    const invalidRoleToken = jwt.sign({ id: 'user123', role: 'guest' }, process.env.JWT_SECRET);

    beforeAll(async () => {
        // Setup database or any global setup
        process.env.TEST_DB_URI = 'mongodb://localhost:27017/test';
        await mongoose.connect(process.env.TEST_DB_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
        jest.clearAllMocks();
    });

    it('should return 401 if no authentication is provided', async () => {
        const response = await request(app).post('/api/payments/create/12345');
        expect(response.status).toBe(401);
    });

    it('should return 403 if user role is invalid', async () => {
        const response = await request(app)
            .post('/api/payments/create/12345')
            .set('Authorization', `Bearer ${invalidRoleToken}`);
        expect(response.status).toBe(403);
    });

    it('should return 400 if orderId is invalid', async () => {
        const response = await request(app)
            .post('/api/payments/create/invalidOrderId')
            .set('Authorization', `Bearer ${validUserToken}`);
        expect(response.status).toBe(400);
    });

    it('should return 200 for a valid request', async () => {
        const response = await request(app)
            .post('/api/payments/create/12345')
            .set('Authorization', `Bearer ${validUserToken}`)
            .send({ amount: 100 });
        expect(response.status).toBe(200);
    });
});