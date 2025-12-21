const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');

jest.mock('razorpay', () => {
    return jest.fn().mockImplementation(() => {
        return {
            utils: {
                validatePaymentVerification: jest.fn().mockReturnValue(true)
            }
        };
    });
});

describe('POST /api/payments/verify', () => {
    const validUserToken = jwt.sign({ id: 'user123', role: 'user' }, process.env.JWT_SECRET);
    const invalidRoleToken = jwt.sign({ id: 'user123', role: 'guest' }, process.env.JWT_SECRET);

    beforeAll(async () => {
        process.env.TEST_DB_URI = 'mongodb://localhost:27017/test';
        await mongoose.connect(process.env.TEST_DB_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
        jest.clearAllMocks();
    });

    it('should return 401 if no authentication is provided', async () => {
        const response = await request(app).post('/api/payments/verify');
        expect(response.status).toBe(401);
    });

    it('should return 403 if user role is invalid', async () => {
        const response = await request(app)
            .post('/api/payments/verify')
            .set('Authorization', `Bearer ${invalidRoleToken}`);
        expect(response.status).toBe(403);
    });

    it('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/api/payments/verify')
            .set('Authorization', `Bearer ${validUserToken}`)
            .send({});
        expect(response.status).toBe(400);
    });

    it('should return 200 for a valid request', async () => {
        const response = await request(app)
            .post('/api/payments/verify')
            .set('Authorization', `Bearer ${validUserToken}`)
            .send({ paymentId: '12345', orderId: '67890' });
        expect(response.status).toBe(200);
    });
});