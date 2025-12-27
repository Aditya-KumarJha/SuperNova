# Payment Microservice

This microservice supports containerization and cloud deployment. It includes a `Dockerfile` and `.dockerignore` for building Docker images, and can be deployed to AWS ECS, ECR, or other container services.

The Payment microservice is responsible for handling payment processing and verification. It provides endpoints for creating and verifying payments. It also integrates with RabbitMQ for event-driven communication.

## Features
- Payment creation
- Payment verification
- Secure payment handling
- Publishes and consumes events via RabbitMQ
- Health Check Endpoint

## Containerization & Cloud Deployment
- **Docker Support**: Includes a `Dockerfile` and `.dockerignore` for building efficient container images.
- **AWS Deployment**: Service can be deployed to AWS using ECS, ECR, or EC2. Update environment variables in your AWS environment or use AWS Secrets Manager/Parameter Store for sensitive data.

### Build & Run with Docker
```bash
docker build -t payment-service .
docker run --env-file .env -p 4006:4006 payment-service
```

### Example AWS Deployment Steps
1. Build Docker image and tag for ECR:
  ```bash
  aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
  docker build -t payment-service .
  docker tag payment-service:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/payment-service:latest
  docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/payment-service:latest
  ```
2. Deploy the image using AWS ECS, EC2, or other container orchestration services.
3. Set environment variables in your AWS task definition or EC2 instance.

### .dockerignore
Ensure you have a `.dockerignore` file to exclude unnecessary files from the Docker build context (e.g., `node_modules`, `tests`, `*.log`).

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
cd SuperNova/payment
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
All endpoints are prefixed with `/api/payment` unless otherwise noted.
### POST /create/:orderId
- **Description**: Create a new payment for an order.
- **Request Body**: `{ amount, currency, paymentMethod }`
- **Response**: `201 Created`

### POST /verify
- **Description**: Verify a payment.
- **Request Body**: `{ paymentId, signature }`
- **Response**: `200 OK`

### GET /
- **Description**: Health check endpoint.
- **Response**: `{ message: 'Payment service is running' }`

## RabbitMQ Integration
- **Queue**: `PAYMENT_NOTIFICATION.PAYMENT_COMPLETED`
  - **Event**: Published when a payment is successfully completed.
  - **Payload**: `{ paymentId, orderId, userId, amount, currency }`
- **Queue**: `PAYMENT_NOTIFICATION.PAYMENT_FAILED`
  - **Event**: Published when a payment fails.
  - **Payload**: `{ paymentId, orderId, userId, amount, currency, failureReason }`
- **Queue**: `PAYMENT_SELLER_DASHBOARD.PAYMENT_CREATED`
  - **Event**: Sends payment data to the seller dashboard.
  - **Payload**: `{ paymentId, orderId, userId, amount, currency }`
- **Queue**: `PAYMENT_NOTIFICATION.PAYMENT_INITIATED`
  - **Event**: Notifies the notification service about payment initiation.
  - **Payload**: `{ paymentId, orderId, userId, amount, currency }`

## Inter-Service Communication
- The `notification` microservice listens to the `PAYMENT_COMPLETED` and `PAYMENT_FAILED` queues.
  - For `PAYMENT_COMPLETED`: Sends a payment success email to the user.
  - For `PAYMENT_FAILED`: Sends a payment failure email to the user.
- The `seller-dashboard` service receives payment data for updates on the seller's dashboard.

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
- `dotenv`
- `express`
- `mongoose`
- `payment-sdk`

## Additional Notes
- **Security**: Use strong secrets and secure your environment variables, especially in production/cloud environments.

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