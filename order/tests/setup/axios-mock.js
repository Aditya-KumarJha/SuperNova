const axios = require('axios');

jest.mock('axios');

// Mock cart service response
const mockCartResponse = {
    data: {
        cart: {
            items: [
                {
                    productId: '507f1f77bcf86cd799439011',
                    quantity: 2
                },
                {
                    productId: '507f1f77bcf86cd799439012',
                    quantity: 1
                }
            ]
        }
    }
};

// Mock product responses
const mockProducts = {
    '507f1f77bcf86cd799439011': {
        data: {
            data: {
                _id: '507f1f77bcf86cd799439011',
                title: 'Product 1',
                price: {
                    amount: 100,
                    currency: 'INR'
                },
                stock: 10
            }
        }
    },
    '507f1f77bcf86cd799439012': {
        data: {
            data: {
                _id: '507f1f77bcf86cd799439012',
                title: 'Product 2',
                price: {
                    amount: 200,
                    currency: 'INR'
                },
                stock: 5
            }
        }
    }
};

// Setup axios mock implementation
axios.get.mockImplementation((url, config) => {
    // Cart service
    if (url.includes('/api/cart')) {
        return Promise.resolve(mockCartResponse);
    }
    
    // Product service
    const productMatch = url.match(/\/api\/products\/([a-f0-9]+)/);
    if (productMatch) {
        const productId = productMatch[1];
        return Promise.resolve(mockProducts[productId] || {
            data: {
                data: {
                    _id: productId,
                    title: 'Default Product',
                    price: { amount: 50, currency: 'INR' },
                    stock: 10
                }
            }
        });
    }
    
    return Promise.reject(new Error('Not found'));
});

module.exports = axios;
