require('dotenv').config();
const mongoose = require('mongoose');

module.exports = async () => {
    // Set up in-memory MongoDB or any other global setup
    process.env.TEST_DB_URI = 'mongodb://localhost:27017/test';
    process.env.RAZORPAY_KEY_ID = 'test_key_id';
    process.env.RAZORPAY_KEY_SECRET = 'test_key_secret';
    await mongoose.connect(process.env.TEST_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
};