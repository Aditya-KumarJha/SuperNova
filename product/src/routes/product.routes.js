const express = require('express');
const multer = require('multer');
const { createProduct } = require('../controllers/product.controller');
const { createAuthMiddleware } = require('../middlewares/auth.middleware');
const { createProductValidators } = require('../validators/product.validator');

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post(
    "/", 
    createAuthMiddleware(["admin", "seller"]),
    upload.array('images', 5),
    createProductValidators,
    createProduct
);

module.exports = router;
