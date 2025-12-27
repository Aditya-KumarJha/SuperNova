# Product Microservice

This microservice supports containerization and cloud deployment. It includes a `Dockerfile` and `.dockerignore` for building Docker images, and can be deployed to AWS ECS, ECR, or other container services.

The Product microservice is responsible for managing product data. It provides endpoints for creating, updating, deleting, and retrieving product information. It also integrates with RabbitMQ for event-driven communication.

## Features
- Create, update, and delete products
- Retrieve product details
- Image upload and management using ImageKit
- Publishes and consumes events via RabbitMQ

## Containerization & Cloud Deployment
- **Docker Support**: Includes a `Dockerfile` and `.dockerignore` for building efficient container images.
- **AWS Deployment**: Service can be deployed to AWS using ECS, ECR, or EC2. Update environment variables in your AWS environment or use AWS Secrets Manager/Parameter Store for sensitive data.

### Build & Run with Docker
```bash
docker build -t product-service .
docker run --env-file .env -p 4001:4001 product-service
```

### Example AWS Deployment Steps
1. Build Docker image and tag for ECR:
  ```bash
  aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
  docker build -t product-service .
  docker tag product-service:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/product-service:latest
  docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/product-service:latest
  ```
2. Deploy the image using AWS ECS, EC2, or other container orchestration services.
3. Set environment variables in your AWS task definition or EC2 instance.

### .dockerignore
Ensure you have a `.dockerignore` file to exclude unnecessary files from the Docker build context (e.g., `node_modules`, `tests`, `*.log`).

## Updated Features
- **Health Check Endpoint**: Provides a health check endpoint at `/` to verify the service status.
- **RabbitMQ Integration**:
  - Publishes events to the following queues:
    - `PRODUCT_NOTIFICATION.PRODUCT_CREATED`: Notifies the notification service about product creation.
    - `PRODUCT_NOTIFICATION.PRODUCT_UPDATED`: Notifies the notification service about product updates.
    - `PRODUCT_NOTIFICATION.PRODUCT_DELETED`: Notifies the notification service about product deletions.
    - `PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED`: Sends product data to the seller dashboard.
- **Inter-Service Communication**:
  - Sends product-related events to the `notification` and `seller-dashboard` services.
  - Example: `notification` service listens to `PRODUCT_CREATED`, `PRODUCT_UPDATED`, and `PRODUCT_DELETED` events to send emails.

## Environment Variables
The following environment variables are required to run this service:

```env
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
IMAGEKIT_PRIVATE_KEY=YOUR_PRIVATE_KEY
IMAGEKIT_PUBLIC_KEY=YOUR_PUBLIC_KEY
IMAGEKIT_URL_ENDPOINT=YOUR_URL_ENDPOINT
RABBITMQ_URL=YOUR_RABBITMQ_CONNECTION_URL
```

## Installation
### Clone the Repository
```bash
git clone https://github.com/Aditya-KumarJha/SuperNova.git
cd SuperNova/product
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
- It publishes events to RabbitMQ queues for product-related actions.
- It provides RESTful endpoints for managing products.

## Endpoints
All endpoints are prefixed with `/api/product` unless otherwise noted.
### POST /products
- **Description**: Create a new product.
- **Request Body**: `{ name, price, description, image }`
- **Response**: `201 Created`

### PATCH /products/:productId
- **Description**: Update product details.
- **Request Body**: `{ name, price, description }`
- **Response**: `200 OK`

### DELETE /products/:productId
- **Description**: Delete a product.
- **Response**: `200 OK`

### GET /products
- **Description**: Retrieve all products.
- **Response**: `200 OK`

### GET /products/:productId
- **Description**: Retrieve a product by ID.
- **Response**: `200 OK`

### GET /products/seller
- **Description**: Retrieve products by the authenticated seller.
- **Response**: `200 OK`

### GET /
- **Description**: Health check endpoint.
- **Response**: `{ message: 'Product service is running' }`

## RabbitMQ Integration
- **Queue**: `PRODUCT_NOTIFICATION.PRODUCT_CREATED`
  - **Event**: Published when a new product is created.
  - **Payload**: `{ productId, name, price, stock, sellerId }`
- **Queue**: `PRODUCT_NOTIFICATION.PRODUCT_UPDATED`
  - **Event**: Published when a product is updated.
  - **Payload**: `{ productId, name, price, stock, sellerId }`
- **Queue**: `PRODUCT_NOTIFICATION.PRODUCT_DELETED`
  - **Event**: Published when a product is deleted.
  - **Payload**: `{ productId, name, price, stock, sellerId }`

## Inter-Service Communication
- The `notification` microservice listens to the `PRODUCT_CREATED`, `PRODUCT_UPDATED`, and `PRODUCT_DELETED` queues.
  - For `PRODUCT_CREATED`: Sends a product creation confirmation email to the seller.
  - For `PRODUCT_UPDATED`: Sends a product update confirmation email to the seller.
  - For `PRODUCT_DELETED`: Sends a product deletion confirmation email to the seller.

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
- `cookie-parser`
- `dotenv`
- `express`
- `express-validator`
- `imagekit`
- `jsonwebtoken`
- `mongoose`
- `multer`
- `uuid`

## Additional Notes
- **Security**: Use strong secrets and secure your environment variables, especially in production/cloud environments.

## Dev Dependencies
- `cross-env`
- `jest`
- `mongodb-memory-server`
- `nodemon`
- `supertest`

## Jest Configuration
```javascript
{
  "testEnvironment": "node",
  "testMatch": [
    "**/tests/**/*.test.js"
  ]
}
```