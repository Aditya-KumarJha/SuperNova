const exppress = require('express');
const { createAuthMiddleware } = require('../middleware/auth.middleware');
const { 
    createOrder, 
    getMyOrders,
    getOrderById,
    cancelOrder,
    updateOrderAddress
} = require('../controllers/order.controller');
const { 
    createOrderValidation, 
    updateAddressValidation 
} = require('../validators/validator.middleware');

const router = exppress.Router();

router.post("/", createAuthMiddleware(["user", "admin"]), createOrderValidation, createOrder);
router.get("/me", createAuthMiddleware(["user", "admin"]), getMyOrders);
router.post("/:id/cancel", createAuthMiddleware(["user", "admin"]), cancelOrder);
router.patch("/:id/address", createAuthMiddleware(["user", "admin"]), updateAddressValidation, updateOrderAddress);
router.get("/:id", createAuthMiddleware(["user", "admin"]), getOrderById);

module.exports = router;
