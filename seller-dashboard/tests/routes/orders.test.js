const request = require('supertest');
const app = require('../../src/app');
const productModel = require('../../src/models/product.model');
const orderModel = require('../../src/models/order.model');
const mongoose = require('mongoose');

jest.mock('../../src/models/product.model');
jest.mock('../../src/models/order.model');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /orders', () => {
  it('should return a list of seller orders', async () => {
    const mockProductId = new mongoose.Types.ObjectId();
    productModel.find.mockResolvedValueOnce([{ _id: mockProductId }]);
    orderModel.find.mockReturnValueOnce({
      populate: jest.fn().mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce([
          {
            items: [{ product: mockProductId, quantity: 10 }],
            user: { name: 'John Doe', email: 'john@example.com' },
            toObject: jest.fn().mockReturnValue({
              items: [{ product: mockProductId, quantity: 10 }],
              user: { name: 'John Doe', email: 'john@example.com' },
            }),
          },
        ]),
      }),
    });

    const response = await request(app)
      .get('/api/seller/dashboard/orders')
      .set('Authorization', 'Bearer validToken');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 500 if there is a server error', async () => {
    productModel.find.mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const response = await request(app)
      .get('/api/seller/dashboard/orders')
      .set('Authorization', 'Bearer validToken');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal Server Error');
  });
});