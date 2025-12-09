const orderModel = require('../models/order.model');
const axios = require('axios');

async function createOrder(req, res) {
    const user = req.user;
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    try{
        // Fetch user cart from Cart Service
        const cartResponse = await axios.get(`http://localhost:4002/api/cart`, {
            headers: { 
                Authorization: `Bearer ${token}` 
            }
        });
        
        const products = await Promise.all(cartResponse.data.cart.items.map(async(item) => {
            return (await axios.get(`http://localhost:4001/api/products/${item.productId}`,{
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            })).data.data;
        }));

        let priceAmount = 0;

        const orderItems = cartResponse.data.cart.items.map((item, index)=> {
            const product = products.find(p => p._id === item.productId);

            // if not in stock doesn't allow order creation
            if(product.stock < item.quantity || !product.stock){
                throw new Error(`Product ${product.title} is out of stock or insufficient quantity`);
            }

            const itemTotal = product.price.amount * item.quantity;
            priceAmount += itemTotal;

            return {
                product: item.productId,
                quantity: item.quantity,
                price: {
                    amount: itemTotal,
                    currency: product.price.currency
                }
            }
        });

        const order = await orderModel.create({
            userId: user.id,
            items: orderItems,
            status: "PENDING",
            totalPrice: {
                amount: priceAmount,
                currency: orderItems[0]?.price.currency || 'INR'
            },
            shippingAddress: {
                street: req.body.shippingAddress.street,
                city: req.body.shippingAddress.city,
                state: req.body.shippingAddress.state,
                zip: req.body.shippingAddress.zip,
                country: req.body.shippingAddress.country,
                phone: req.body.shippingAddress.phone,
            }
        });

        res.status(201).json({ 
            message: 'Order created successfully',
            order
        });
    } catch(error){
        console.error("Error creating order:", error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

module.exports = {
    createOrder
};