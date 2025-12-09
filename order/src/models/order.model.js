const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone: String
});

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    items:[{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        quantity: {
            type: Number,
            min: 1,
            default: 1
        },
        price: {
            amount: {
                type: Number,
                required: true
            },
            currency: {
                type: String,
                required: true,
                enum: ['USD', 'EUR', 'INR' ],
                default: 'INR'
            }
        }
    }],
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    },
    totalPrice: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true,
            enum: ['USD', 'EUR', 'INR' ],
            default: 'INR'
        }
    },
    shippingAddress: {
        type: addressSchema,
        required: true
    },
}, { timestamps: true });

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
