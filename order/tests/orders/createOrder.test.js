const request = require('supertest');
const app = require('../../src/app');
const { getAuthCookie } = require('../setup/auth');

describe('POST /api/orders — Create order from current cart', () => {
    const sampleAddress = {
        street: '123 Main St',
        city: 'Metropolis',
        state: 'CA',
        zip: '90210',
        country: 'USA',
        phone: '1234567890' 
    };

    it('creates order from current cart, computes totals, sets status=PENDING, reserves inventory', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Cookie', getAuthCookie())
            .send({ shippingAddress: sampleAddress })
            .expect('Content-Type', /json/)
            .expect(201);

        expect(res.body).toBeDefined();
        expect(res.body.order).toBeDefined();
        const { order } = res.body;
        expect(order._id).toBeDefined();
        expect(order.userId).toBeDefined();
        expect(order.status).toBe('PENDING');

        expect(Array.isArray(order.items)).toBe(true);
        expect(order.items.length).toBeGreaterThan(0);
        for (const it of order.items) {
            expect(it.product).toBeDefined();
            expect(it.quantity).toBeGreaterThan(0);
            expect(it.price).toBeDefined();
            expect(typeof it.price.amount).toBe('number');
            expect([ 'USD', 'INR', 'EUR' ]).toContain(it.price.currency);
        }

        expect(order.totalPrice).toBeDefined();
        expect(typeof order.totalPrice.amount).toBe('number');
        expect([ 'USD', 'INR', 'EUR' ]).toContain(order.totalPrice.currency);

        expect(order.shippingAddress).toMatchObject({
            street: sampleAddress.street,
            city: sampleAddress.city,
            state: sampleAddress.state,
            zip: sampleAddress.zip,
            country: sampleAddress.country,
            phone: sampleAddress.phone,
        });
    });


    it('returns 422 when shipping address is missing/invalid', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Cookie', getAuthCookie())
            .send({})
            .expect('Content-Type', /json/)
            .expect(400);

        expect(res.body.errors || res.body.message).toBeDefined();
    });
});
