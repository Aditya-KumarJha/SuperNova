const paymentModel = require('../models/payment.model');
const axios = require('axios');
const Razorpay = require('razorpay');
const mongoose = require('mongoose');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createPayment(req, res) {
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
    try {
        const orderId = req.params.orderId;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'Invalid orderId' });
        }

        const orderResponse = await axios.get(`http://localhost:4003/api/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const price = orderResponse.data.order.totalPrice;

        const order = await razorpay.orders.create(price);

        const payment = await paymentModel.create({
            orderId: orderId,
            razorpayOrderId: order.id,
            user: req.user.id,
            price: {
                amount: order.amount,
                currency: order.currency
            }
        });

        return res.status(201).json({
            message: 'Payment initiated successfully',
            payment: payment
        });

    } catch (error) {
        console.error('Error creating payment:', error);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

async function verifyPayment(req, res) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    try {
        const { validatePaymentVerification } = require('../../node_modules/razorpay/dist/utils/razorpay-utils');

        const isValid = validatePaymentVerification({
            order_id: razorpayOrderId,
            payment_id: razorpayPaymentId
        }, razorpaySignature, secret);

        if(!isValid) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        const payment = await paymentModel.findOne({ razorpayOrderId: razorpayOrderId, status: 'PENDING' });
        
        if(!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        payment.razorpayPaymentId = razorpayPaymentId;
        payment.signature = razorpaySignature;
        payment.status = 'COMPLETED';

        await payment.save();

        res.status(200).json({ message: 'Payment verified successfully', payment: payment });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error verifying payment');
    }
};

module.exports = {
    createPayment,
    verifyPayment
};