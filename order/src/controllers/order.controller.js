const orderModel = require('../models/order.model');
const axios = require('axios');
const mongoose = require('mongoose');
const { publishToQueue } = require('../broker/broker');

async function createOrder(req, res) {
    const user = req.user;
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    try{
        // Fetch user cart from Cart Service
        const cartResponse = await axios.get(`http://nova-alb-28718941.ap-northeast-3.elb.amazonaws.com/api/cart`, {
            headers: { 
                Authorization: `Bearer ${token}` 
            }
        });
        
        const products = await Promise.all(cartResponse.data.cart.items.map(async(item) => {
            return (await axios.get(`http://nova-alb-28718941.ap-northeast-3.elb.amazonaws.com/api/products/${item.productId}`,{
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

        await publishToQueue('ORDER_SELLER_DASHBOARD.ORDER_CREATED', order);

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

async function getMyOrders(req, res) {
    const user = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    try {
        const orders = await orderModel.find({ userId: user.id }).skip(skip).limit(limit).exec();
        const totalOrders = await orderModel.countDocuments({ userId: user.id });

        res.status(200).json({
            message: "Orders fetched successfully",
            orders,
            meta: {
                total: totalOrders,
                page,
                limit
            }
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
};

async function getOrderById(req, res) {
    const user = req.user;
    const orderId = req.params.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(404).json({ message: "Order not found" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (!order.userId || (order.userId.toString() !== user.id && user.role !== 'admin')) {
            return res.status(404).json({ message: "Access denied" });
        }

        res.status(200).json({ message: "Order fetched successfully", order });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

async function cancelOrder(req, res) {
    const user = req.user;
    const orderId = req.params.id;

    try {
        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.userId.toString() !== user.id) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this order" });
        }

        if (order.status !== "PENDING") {
            return res.status(409).json({ message: "Order cannot be cancelled at this stage" });
        }

        order.status = "CANCELLED";
        await order.save();

        try {
            await publishToQueue('ORDER_NOTIFICATION.ORDER_CANCELLED', {
                email: req.user.email,
                fullName: req.user.fullName,
                orderId: order._id,
                totalPrice: order.totalPrice,
                cancelledAt: new Date().toISOString(),
            });
        } catch (queueError) {
            console.error('Error publishing ORDER_NOTIFICATION.ORDER_CANCELLED:', queueError);
        }

        res.status(200).json({ message: "Order cancelled successfully", order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

async function updateOrderAddress(req, res) {
    const user = req.user;
    const orderId = req.params.id;

    try {
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.userId.toString() !== user.id) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this order" });
        }

        if (order.status !== "PENDING") {
            return res.status(409).json({ message: "Order address cannot be updated at this stage" });
        }

        order.shippingAddress = {
            street: req.body.shippingAddress.street,
            city: req.body.shippingAddress.city,
            state: req.body.shippingAddress.state,
            zip: req.body.shippingAddress.zip,
            country: req.body.shippingAddress.country,
            phone: req.body.shippingAddress.phone,
        };

        await order.save();

        res.status(200).json({ message: "Shipping address updated successfully", order });
    }catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    updateOrderAddress
};