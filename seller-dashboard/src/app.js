const express = require('express');
const cookieParser = require('cookie-parser');
const sellerRoutes = require('./routes/seller.routes');

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api/seller/dashboard', sellerRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Seller Dashboard service is running' });
});

module.exports = app;
