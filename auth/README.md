# Auth Microservice

The Auth microservice is responsible for handling user authentication and authorization. It provides endpoints for user registration, login, logout, and session management.

## Features
- User registration and login
- JWT-based authentication
- Redis-based session management
- Input validation using `express-validator`

## Environment Variables
The following environment variables are required to run this service:

```env
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
REDIS_HOST=YOUR_REDIS_HOST
REDIS_PORT=YOUR_REDIS_PORT
REDIS_PASSWORD=YOUR_REDIS_PASSWORD
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Aditya-KumarJha/SuperNova.git
   ```
2. Navigate to the `auth` directory:
   ```bash
   cd auth
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Scripts
- `npm run dev`: Start the development server with `nodemon`.
- `npm start`: Start the production server.
- `npm test`: Run tests using Jest.
- `npm run test:watch`: Run tests in watch mode.

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

## Testing
Jest is used for testing. Test files are located in the `__tests__` directory.

## Dependencies
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