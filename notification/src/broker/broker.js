const amqplib = require('amqplib');

let channel, connection;

async function connect() {
    // Reuse existing open connection
    if (connection) return connection;

    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        console.log('Connected to RabbitMQ');
        channel = await connection.createChannel();

        // Prevent unhandled errors from crashing the process
        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err.message || err);
        });

        connection.on('close', () => {
            console.warn('RabbitMQ connection closed');
            // Clear references so that the next publish/subscribe call reconnects
            connection = null;
            channel = null;
        });
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        // Ensure failed connection attempts don't leave stale references
        connection = null;
        channel = null;
    }
};

async function publishToQueue(queueName, data = {}) {
    if (!channel || !connection) {
        await connect();
    }

    if (!channel) {
        console.error('Unable to publish message: RabbitMQ channel is not available');
        return;
    }

    await channel.assertQueue(queueName, {
        durable: true,
    });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    console.log(`Message sent to queue ${queueName}, data ${JSON.stringify(data)}`);
};

async function subscribeToQueue(queueName, callback) {
    if (!channel || !connection) {
        await connect();
    }

    if (!channel) {
        console.error('Unable to subscribe: RabbitMQ channel is not available');
        return;
    }

    await channel.assertQueue(queueName, {
        durable: true,
    });

    channel.consume(queueName, async (msg) => {
        if (msg !== null) {
            const data = JSON.parse(msg.content.toString());
            await callback(data);
            channel.ack(msg);
        }
    });
};

module.exports = {
    channel,
    connection,
    connect,
    publishToQueue,
    subscribeToQueue,
};
