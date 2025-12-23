const express = require('express');
const { createAuthMiddleware } = require('../middleware/auth.middleware');
const { getSellerMetrics, getSellerOrders, getSellerProducts } = require('../controllers/seller.controller');

const router = express.Router();

router.get('/metrics', createAuthMiddleware([ 'seller', 'admin' ]), getSellerMetrics);
router.get('/orders', createAuthMiddleware([ 'seller', 'admin' ]), getSellerOrders);
router.get('/products', createAuthMiddleware([ 'seller', 'admin' ]), getSellerProducts);

module.exports = router;
