# Payment Microservice

The Payment microservice is responsible for handling payment processing and verification. It provides endpoints for creating and verifying payments. It also integrates with RabbitMQ for event-driven communication.

## Features
- Payment creation
- Payment verification
- Secure payment handling
- Publishes and consumes events via RabbitMQ

## Environment Variables
The following environment variables are required to run this service:

```env
MONGODB_URI=YOUR_MONGODB_URI
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
RABBITMQ_URL=YOUR_RABBITMQ_CONNECTION_URL
```

## Installation
### Clone the Repository
```bash
git clone https://github.com/Aditya-KumarJha/SuperNova.git
```

### Navigate to the `payment` Directory
```bash
cd payment
```

### Install Dependencies
```bash
npm install
```

## Scripts
### Start the Development Server
```bash
npm run dev
```

### Start the Production Server
```bash
npm start
```

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## How It Works
- The service connects to RabbitMQ using the URL from `RABBITMQ_URL`.
- It publishes events to RabbitMQ queues for payment-related actions.
- It provides RESTful endpoints for managing payments.

## Endpoints
### POST /create/:orderId
- **Description**: Create a new payment for an order.
- **Request Body**: `{ amount, currency, paymentMethod }`
- **Response**: `201 Created`

### POST /verify
- **Description**: Verify a payment.
- **Request Body**: `{ paymentId, signature }`
- **Response**: `200 OK`

## RabbitMQ Integration
- **Queue**: `PAYMENT_NOTIFICATION.PAYMENT_COMPLETED`
  - **Event**: Published when a payment is successfully completed.
  - **Payload**: `{ paymentId, orderId, userId, amount, currency }`
- **Queue**: `PAYMENT_NOTIFICATION.PAYMENT_FAILED`
  - **Event**: Published when a payment fails.
  - **Payload**: `{ paymentId, orderId, userId, amount, currency, failureReason }`

## Inter-Service Communication
- The `notification` microservice listens to the `PAYMENT_COMPLETED` and `PAYMENT_FAILED` queues.
  - For `PAYMENT_COMPLETED`: Sends a payment success email to the user.
  - For `PAYMENT_FAILED`: Sends a payment failure email to the user.

## Testing
Jest is used for testing. Test files are located in the `tests` directory.

## Dependencies
- `amqplib`
- `dotenv`
- `express`
- `mongoose`
- `payment-sdk`

## Dev Dependencies
- `jest`
- `supertest`

## Jest Configuration
```javascript
/** @type {import('jest').Config} */

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup/globalSetup.js'],
    collectCoverageFrom: ['src/**/*.js', '!src/**/index.js'],
    verbose: true,
};
```