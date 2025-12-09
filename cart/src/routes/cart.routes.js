const express = require('express');
const { createAuthMiddleware } = require('../middlewares/auth.middleware');
const { 
    addItemToCart, 
    updateCartItem, 
    getCart,
    deleteItem,
    clearCart
} = require('../controller/cart.controller');
const { 
    validateAddItemToCart, 
    validateUpdateCartItem,
    validateDeleteCartItem
} = require('../validator/validation.middleware');

const router = express.Router();

router.post(
    "/items", 
    createAuthMiddleware([ "user" ]), 
    validateAddItemToCart, 
    addItemToCart
);

router.patch(
    "/items/:productId", 
    createAuthMiddleware([ "user" ]),
    validateUpdateCartItem,
    updateCartItem
);

router.get(
    "/",
    createAuthMiddleware([ "user" ]),
    getCart
);

router.delete(
    "/items/:productId",
    createAuthMiddleware([ "user" ]),
    validateDeleteCartItem,
    deleteItem
);

router.delete(
    "/",
    createAuthMiddleware([ "user" ]),
    clearCart
);

module.exports = router;
