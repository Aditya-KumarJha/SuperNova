const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

jest.mock('../src/models/cart.model.js', () => {
    function mockGenerateObjectId() {
        return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }
    const carts = new Map();
    class CartMock {
        constructor({ user, items }) {
            this._id = mockGenerateObjectId();
            this.user = user;
            this.items = items || [];
        }
        static async findOne(query) {
            return carts.get(query.user) || null;
        }
        async save() {
            carts.set(this.user, this);
            return this;
        }
    }
    CartMock.__reset = () => carts.clear();
    return CartMock;
});

const CartModel = require('../src/models/cart.model.js');

function generateObjectId() {
    return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const postEndpoint = '/api/cart/items';
const clearEndpoint = '/api/cart';

describe('DELETE /api/cart', () => {
    const userId = generateObjectId();
    const productIdA = generateObjectId();
    const productIdB = generateObjectId();

    beforeEach(() => {
        CartModel.__reset();
    });

    test('clears all items from cart', async () => {
        const token = signToken({ id: userId, role: 'user' });
        
        // Add items to cart
        await request(app)
            .post(postEndpoint)
            .set('Authorization', `Bearer ${token}`)
            .send({ productId: productIdA, qty: 2 });
        
        await request(app)
            .post(postEndpoint)
            .set('Authorization', `Bearer ${token}`)
            .send({ productId: productIdB, qty: 3 });

        // Clear cart
        const res = await request(app)
            .delete(clearEndpoint)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Cart cleared successfully');
        expect(res.body.cart).toBeDefined();
        expect(res.body.cart.items).toHaveLength(0);
    });

    test('returns 404 when cart does not exist', async () => {
        const token = signToken({ id: userId, role: 'user' });
        
        const res = await request(app)
            .delete(clearEndpoint)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Cart not found');
    });

    test('successfully clears cart with single item', async () => {
        const token = signToken({ id: userId, role: 'user' });
        
        // Add one item to cart
        await request(app)
            .post(postEndpoint)
            .set('Authorization', `Bearer ${token}`)
            .send({ productId: productIdA, qty: 5 });

        // Clear cart
        const res = await request(app)
            .delete(clearEndpoint)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Cart cleared successfully');
        expect(res.body.cart.items).toHaveLength(0);
    });

    test('401 when no token', async () => {
        const res = await request(app).delete(clearEndpoint);
        expect(res.status).toBe(401);
    });

    test('403 when role not allowed', async () => {
        const token = signToken({ id: userId, role: 'admin' });
        const res = await request(app)
            .delete(clearEndpoint)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(403);
    });

    test('401 when token invalid', async () => {
        const res = await request(app)
            .delete(clearEndpoint)
            .set('Authorization', 'Bearer invalid.token.here');
        expect(res.status).toBe(401);
    });
});
