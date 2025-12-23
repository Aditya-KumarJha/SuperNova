# Auth Microservice

The Auth microservice is responsible for handling user authentication and authorization. It provides endpoints for user registration, login, logout, and session management.

## Features
- User registration and login
- JWT-based authentication
- Redis-based session management
- Input validation using `express-validator`
- Address management: Users can add, retrieve, and set default addresses
- RabbitMQ integration for event-driven communication
- Health Check Endpoint: Provides a health check endpoint at `/` to verify the service status.

## Environment Variables
The following environment variables are required to run this service:

```env
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
REDIS_HOST=YOUR_REDIS_HOST
REDIS_PORT=YOUR_REDIS_PORT
REDIS_PASSWORD=YOUR_REDIS_PASSWORD
RABBITMQ_URL=YOUR_RABBITMQ_URL
```

## Installation
### Clone the Repository
```bash
git clone https://github.com/Aditya-KumarJha/SuperNova.git
```

### Navigate to the `auth` Directory
```bash
cd auth
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
### POST /register
- **Description**: Register a new user.
- **Request Body**: `{ username, password, email }`
- **Response**: `201 Created`

### POST /login
- **Description**: Log in a user.
- **Request Body**: `{ username, password }`
- **Response**: `200 OK`

### GET /me
- **Description**: Get the current user's details.
- **Response**: `200 OK`

### POST /logout
- **Description**: Log out the current user.
- **Response**: `200 OK`

### GET /api/auth/users/me/addresses
- **Description**: Retrieve a list of user addresses.
- **Response**: `200 OK`

### POST /api/auth/users/me/addresses
- **Description**: Add a new address for the user.
- **Request Body**: `{ street, city, state, zip, country, isDefault }`
- **Response**: `201 Created`

### GET /
- **Description**: Health check endpoint.
- **Response**: `{ message: 'Auth service is running' }`

## RabbitMQ Integration
- **Queue**: `AUTH_NOTIFICATION.USER_CREATED`
  - **Event**: Published when a new user is created.
  - **Payload**: `{ userId, username, email, fullName }`
- **Queue**: `AUTH_SELLER_DASHBOARD.USER_CREATED`
  - **Event**: Sends user data to the seller dashboard.
  - **Payload**: `{ userId, username, email, fullName }`
- **Queue**: `AUTH_NOTIFICATION.USER_LOGGED_IN`
  - **Event**: Published when a user logs in.
  - **Payload**: `{ userId, username, email, fullName }`

## Inter-Service Communication
- The `notification` microservice listens to the `USER_CREATED` and `USER_LOGGED_IN` queues.
  - For `USER_CREATED`: Sends a welcome email to the user.
  - For `USER_LOGGED_IN`: Sends a login notification email to the user.
- User-related events are sent to the `notification` and `seller-dashboard` services.

## Testing
Jest is used for testing. Test files are located in the `__tests__` directory.

## Dependencies
- `amqplib`
- `bcryptjs`
- `cookie-parser`
- `dotenv`
- `express`
- `express-validator`
- `ioredis`
- `jsonwebtoken`
- `mongoose`

## Dev Dependencies
- `jest`
- `mongodb-memory-server`
- `nodemon`
- `supertest`

## Jest Configuration
```javascript
/** @type {import('jest').Config} */

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
    collectCoverageFrom: ['src/**/*.js', '!src/**/index.js'],
    verbose: true,
};
```