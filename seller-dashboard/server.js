require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');
const { connect } = require('./src/broker/broker');
const listener = require('./src/broker/listener');

// Connect to RabbitMQ
connect().then(() => {
    // Start listening to queues
    listener();
});

// Connect to the database
connectDB();

app.listen(4007, () => {
    console.log('Seller Dashboard service is running on port 4007');
});
