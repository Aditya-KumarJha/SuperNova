# Order Microservice

The Order microservice is responsible for managing orders. It provides endpoints for creating, updating, retrieving, and canceling orders. It also integrates with RabbitMQ for event-driven communication.

## Features
- Create and update orders
- Retrieve order details
- Cancel orders
- Publishes and consumes events via RabbitMQ

## Environment Variables
The following environment variables are required to run this service:

```env
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
RABBITMQ_URL=YOUR_RABBITMQ_CONNECTION_URL
```

## Installation
### Clone the Repository
```bash
git clone https://github.com/Aditya-KumarJha/SuperNova.git
```

### Navigate to the `order` Directory
```bash
cd order
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

## How It Works
- The service connects to RabbitMQ using the URL from `RABBITMQ_URL`.
- It publishes events to RabbitMQ queues for order-related actions.
- It provides RESTful endpoints for managing orders.

## Endpoints
### POST /orders
- **Description**: Create a new order.
- **Request Body**: `{ items, address, paymentMethod }`
- **Response**: `201 Created`

### GET /orders/me
- **Description**: Retrieve all orders for the authenticated user.
- **Response**: `200 OK`

### GET /orders/:orderId
- **Description**: Retrieve an order by ID.
- **Response**: `200 OK`

### POST /orders/:orderId/cancel
- **Description**: Cancel an order.
- **Response**: `200 OK`

### PATCH /orders/:orderId/address
- **Description**: Update the address for an order.
- **Request Body**: `{ address }`
- **Response**: `200 OK`

### DELETE /orders/:orderId
- **Description**: Cancel an order.
- **Response**: `200 OK`

## RabbitMQ Integration
- **Queue**: `ORDER_NOTIFICATION.ORDER_CREATED`
  - **Event**: Published when a new order is created.
  - **Payload**: `{ orderId, userId, items, totalPrice, address }`
- **Queue**: `ORDER_NOTIFICATION.ORDER_CANCELLED`
  - **Event**: Published when an order is canceled.
  - **Payload**: `{ orderId, userId, cancelledAt }`

## Inter-Service Communication
- The `notification` microservice listens to the `ORDER_CREATED` and `ORDER_CANCELLED` queues.
  - For `ORDER_CREATED`: Sends an order confirmation email to the user.
  - For `ORDER_CANCELLED`: Sends an order cancellation email to the user.

## Testing
Jest is used for testing. Test files are located in the `tests` directory.

## Dependencies
- `amqplib`
- `axios`
- `cookie-parser`
- `dotenv`
- `express`
- `express-validator`
- `jsonwebtoken`
- `mongoose`
- `supertest`

## Dev Dependencies
- `jest`
- `mongodb-memory-server`

## Jest Configuration
```javascript
/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    roots: [ '<rootDir>/tests' ],
    setupFiles: [ 
        '<rootDir>/tests/setup/env.js',
        '<rootDir>/tests/setup/axios-mock.js'
    ],
    setupFilesAfterEnv: [ '<rootDir>/tests/setup/mongodb.js' ],
};
```