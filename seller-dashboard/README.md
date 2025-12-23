# Seller Dashboard Microservice

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
```

### Navigate to the `seller-dashboard` Directory
```bash
cd seller-dashboard
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

## Dependencies
- `cookie-parser`
- `dotenv`
- `express`
- `express-validator`
- `jsonwebtoken`
- `mongoose`

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