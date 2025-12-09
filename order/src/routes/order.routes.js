const exppress = require('express');
const { createAuthMiddleware } = require('../middleware/auth.middleware');
const { createOrder } = require('../controllers/order.controller');
const { createOrderValidation } = require('../validators/validator.middleware');

const router = exppress.Router();

router.post("/", createAuthMiddleware(["user", "admin"]), createOrderValidation, createOrder);

module.exports = router;
