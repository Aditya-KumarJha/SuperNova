const express = require("express");
const cookieParser = require("cookie-parser");
const cartRoutes = require("./routes/cart.routes");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/cart", cartRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Cart service is running' });
});

module.exports = app;
