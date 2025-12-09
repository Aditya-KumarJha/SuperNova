const Product = require('../models/product.model');
const { uploadImage } = require('../services/imagekit.service');

async function createProduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency = 'INR' } = req.body;
        if(!title || !priceAmount) {
            return res.status(400).json({ message: "Title and Price Amount are required" });
        }
        const seller = req.user.id;

        const price = {
            amount: Number(priceAmount),
            currency: priceCurrency
        };
        const images = await Promise.all((req.files || []).map(file => uploadImage({ buffer: file.buffer })));

        const product = await Product.create({ title, description, price, seller, images });
        
        res.status(201).json({
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createProduct
};
