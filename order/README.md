# Order Microservice

This microservice supports containerization and cloud deployment. It includes a `Dockerfile` and `.dockerignore` for building Docker images, and can be deployed to AWS ECS, ECR, or other container services.

The Order microservice is responsible for managing orders. It provides endpoints for creating, updating, retrieving, and canceling orders. It also integrates with RabbitMQ for event-driven communication.

## Features
- Create and update orders
- Retrieve order details
- Cancel orders
- Publishes and consumes events via RabbitMQ
- Health Check Endpoint: Provides a health check endpoint at `/` to verify the service status.

## Containerization & Cloud Deployment
- **Docker Support**: Includes a `Dockerfile` and `.dockerignore` for building efficient container images.
- **AWS Deployment**: Service can be deployed to AWS using ECS, ECR, or EC2. Update environment variables in your AWS environment or use AWS Secrets Manager/Parameter Store for sensitive data.

### Build & Run with Docker
```bash
docker build -t order-service .
docker run --env-file .env -p 4003:4003 order-service
```

### Example AWS Deployment Steps
1. Build Docker image and tag for ECR:
  ```bash
  aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
  docker build -t order-service .
  docker tag order-service:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/order-service:latest
  docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/order-service:latest
  ```
2. Deploy the image using AWS ECS, EC2, or other container orchestration services.
3. Set environment variables in your AWS task definition or EC2 instance.

### .dockerignore
Ensure you have a `.dockerignore` file to exclude unnecessary files from the Docker build context (e.g., `node_modules`, `tests`, `*.log`).

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
cd SuperNova/order
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
All endpoints are prefixed with `/api/order` unless otherwise noted.
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

### GET /
- **Description**: Health check endpoint.
- **Response**: `{ message: 'Order service is running' }`

## RabbitMQ Integration
- **Queue**: `ORDER_NOTIFICATION.ORDER_CREATED`
  - **Event**: Published when a new order is created.
  - **Payload**: `{ orderId, userId, items, totalPrice, address }`
- **Queue**: `ORDER_NOTIFICATION.ORDER_CANCELLED`
  - **Event**: Published when an order is canceled.
  - **Payload**: `{ orderId, userId, cancelledAt }`
- Publishes events to the following queues:
  - `ORDER_SELLER_DASHBOARD.ORDER_CREATED`: Sends order data to the seller dashboard.
  - `ORDER_NOTIFICATION.ORDER_CANCELLED`: Notifies the notification service about order cancellations.

## Inter-Service Communication
- The `notification` microservice listens to the `ORDER_CREATED` and `ORDER_CANCELLED` queues.
  - For `ORDER_CREATED`: Sends an order confirmation email to the user.
  - For `ORDER_CANCELLED`: Sends an order cancellation email to the user.
- Sends order-related events to the `notification` and `seller-dashboard` services.

## Testing
Jest is used for testing. Test files are located in the `tests` directory.

## .dockerignore Example
```
node_modules
tests
*.log
Dockerfile
.env
```

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

## Additional Notes
- **Security**: Use strong secrets and secure your environment variables, especially in production/cloud environments.

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