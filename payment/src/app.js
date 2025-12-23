const express = require('express');
const cookieParser = require('cookie-parser');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Payment service is running' });
});

module.exports = app;
