require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const { connect } = require('./src/broker/broker');

// Connect to RabbitMQ
connect();

// Connect to Database
connectDB();


app.listen(4004, () => {
    console.log('Payment service is running on port 4004');
});
