const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const productModel = require('../../src/models/product.model');
const orderModel = require('../../src/models/order.model');

jest.mock('../../src/models/product.model');
jest.mock('../../src/models/order.model');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /metrics', () => {
  it('should return seller metrics with sales, revenue, and top products', async () => {
    const mockProductId = new mongoose.Types.ObjectId();
    productModel.find.mockResolvedValueOnce([{ _id: mockProductId, title: 'Product 1' }]);
    orderModel.find.mockResolvedValueOnce([
      {
        items: [
          { product: mockProductId, quantity: 10, price: { amount: 100 } },
        ],
      },
    ]);

    const response = await request(app)
      .get('/api/seller/dashboard/metrics')
      .set('Authorization', 'Bearer validToken');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('sales', 10);
    expect(response.body).toHaveProperty('revenue', 1000);
    expect(response.body).toHaveProperty('topProducts');
  });

  it('should return 500 if there is a server error', async () => {
    productModel.find.mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const response = await request(app)
      .get('/api/seller/dashboard/metrics')
      .set('Authorization', 'Bearer validToken');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal Server Error');
  });
});