# Seller Dashboard Microservice

This microservice supports containerization and cloud deployment. It includes a `Dockerfile` and `.dockerignore` for building Docker images, and can be deployed to AWS ECS, ECR, or other container services.

The Seller Dashboard microservice is responsible for managing seller-related operations. It provides endpoints for managing products, orders, and other seller-specific functionalities.

## Features
- **Product Management**:
  - Add, update, and delete products.
  - Retrieve product details.
- **Order Management**:
  - View and manage orders.
  - Update order statuses.
- **Health Check Endpoint**: Provides a health check endpoint at `/` to verify the service status.
- **RabbitMQ Integration**: For event-driven communication between microservices.

## Containerization & Cloud Deployment
- **Docker Support**: Includes a `Dockerfile` and `.dockerignore` for building efficient container images.
- **AWS Deployment**: Service can be deployed to AWS using ECS, ECR, or EC2. Update environment variables in your AWS environment or use AWS Secrets Manager/Parameter Store for sensitive data.

### Build & Run with Docker
```bash
docker build -t seller-dashboard-service .
docker run --env-file .env -p 4007:4007 seller-dashboard-service
```

### Example AWS Deployment Steps
1. Build Docker image and tag for ECR:
   ```bash
   aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
   docker build -t seller-dashboard-service .
   docker tag seller-dashboard-service:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/seller-dashboard-service:latest
   docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/seller-dashboard-service:latest
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
RABBITMQ_URL=YOUR_RABBITMQ_URL
```

## Installation
### Clone the Repository
```bash
git clone https://github.com/Aditya-KumarJha/SuperNova.git
cd SuperNova/seller-dashboard
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

## Endpoints
All endpoints are prefixed with `/api/seller` unless otherwise noted.
### Product Management
#### POST /products
- **Description**: Add a new product.
- **Request Body**: `{ name, description, price, stock, category }`
- **Response**: `201 Created`

#### PATCH /products/:productId
- **Description**: Update product details.
- **Request Body**: `{ name, description, price, stock, category }`
- **Response**: `200 OK`

#### DELETE /products/:productId
- **Description**: Delete a product.
- **Response**: `200 OK`

#### GET /products
- **Description**: Retrieve all products.
- **Response**: `200 OK`

### Order Management
#### GET /orders
- **Description**: Retrieve all orders.
- **Response**: `200 OK`

#### PATCH /orders/:orderId
- **Description**: Update order status.
- **Request Body**: `{ status }`
- **Response**: `200 OK`

### Health Check
#### GET /
- **Description**: Health check endpoint.
- **Response**: `{ message: 'Seller Dashboard service is running' }`

## RabbitMQ Integration
- **Queue**: `SELLER_DASHBOARD.PRODUCT_CREATED`
  - **Event**: Published when a new product is created.
  - **Payload**: `{ productId, name, price, stock, category }`
- **Queue**: `SELLER_DASHBOARD.ORDER_UPDATED`
  - **Event**: Published when an order status is updated.
  - **Payload**: `{ orderId, status }`

## Inter-Service Communication
- The `notification` microservice listens to the `ORDER_UPDATED` queue to notify customers about order status changes.
- The `product` microservice listens to the `PRODUCT_CREATED` queue to update product catalogs.

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
- `cookie-parser`
- `dotenv`
- `express`
- `express-validator`
- `jsonwebtoken`
- `mongoose`

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
    roots: ['<rootDir>/tests'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.js', '!src/db/**'],
    moduleFileExtensions: ['js', 'json'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup/globalSetup.js']
};
```