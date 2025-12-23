const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const productModel = require('../../src/models/product.model');

jest.mock('../../src/models/product.model');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /products', () => {
  it('should return a list of seller products', async () => {
    productModel.find.mockReturnValueOnce({
      sort: jest.fn().mockResolvedValueOnce([
        { _id: new mongoose.Types.ObjectId(), title: 'Product 1' },
      ]),
    });

    const response = await request(app)
      .get('/api/seller/dashboard/products')
      .set('Authorization', 'Bearer validToken');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 500 if there is a server error', async () => {
    productModel.find.mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const response = await request(app)
      .get('/api/seller/dashboard/products')
      .set('Authorization', 'Bearer validToken');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal Server Error');
  });
});