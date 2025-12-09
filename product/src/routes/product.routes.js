const express = require('express');
const multer = require('multer');
const { 
    createProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    getProductsBySeller 
} = require('../controllers/product.controller');
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

router.get("/", getProducts);

router.patch("/:id", createAuthMiddleware(["admin", "seller"]), updateProduct);

router.delete("/:id", createAuthMiddleware(["admin", "seller"]), deleteProduct);

router.get("/seller", createAuthMiddleware(["admin", "seller"]), getProductsBySeller);

router.get("/:id", getProductById);

module.exports = router;
