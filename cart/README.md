# Cart Microservice

This microservice supports containerization and cloud deployment. It includes a `Dockerfile` and `.dockerignore` for building Docker images, and can be deployed to AWS ECS, ECR, or other container services.

The Cart microservice is responsible for managing user carts. It provides endpoints for adding, updating, and removing items from the cart.

## Updated Features
- **Health Check Endpoint**: Provides a health check endpoint at `/` to verify the service status.
- **Cart Management**:
  - Add, update, and remove items in the cart.
  - Clear the entire cart.
  - Retrieve cart details, including total item count and quantity.

## Containerization & Cloud Deployment
- **Docker Support**: Includes a `Dockerfile` and `.dockerignore` for building efficient container images.
- **AWS Deployment**: Service can be deployed to AWS using ECS, ECR, or EC2. Update environment variables in your AWS environment or use AWS Secrets Manager/Parameter Store for sensitive data.

### Build & Run with Docker
```bash
docker build -t cart-service .
docker run --env-file .env -p 4002:4002 cart-service
```

### Example AWS Deployment Steps
1. Build Docker image and tag for ECR:
  ```bash
  aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
  docker build -t cart-service .
  docker tag cart-service:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/cart-service:latest
  docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/cart-service:latest
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
```

## Installation
### Clone the Repository
```bash
git clone https://github.com/Aditya-KumarJha/SuperNova.git
cd SuperNova/cart
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
All endpoints are prefixed with `/api/cart` unless otherwise noted.
### POST /cart
- **Description**: Add an item to the cart.
- **Request Body**: `{ productId, quantity }`
- **Response**: `201 Created`

### PATCH /cart/:itemId
- **Description**: Update the quantity of an item in the cart.
- **Request Body**: `{ quantity }`
- **Response**: `200 OK`

### DELETE /cart/:itemId
- **Description**: Remove an item from the cart.
- **Response**: `200 OK`

### GET /cart
- **Description**: Retrieve the user's cart.
- **Response**: `200 OK`

### GET /
- **Description**: Health check endpoint.
- **Response**: `{ message: 'Cart service is running' }`

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
/**
 * Jest configuration for Cart service
 */
module.exports = {
    testEnvironment: 'node',
    roots: [ '<rootDir>/tests' ],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [ 'src/**/*.js', '!src/db/**' ],
    moduleFileExtensions: [ 'js', 'json' ],
    setupFilesAfterEnv: [ '<rootDir>/tests/setup/globalSetup.js' ]
};
```