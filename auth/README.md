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
MONGODB_URI=mongodb+srv://adikumarjha12:ImYNWTStwlngXfZY@cluster0.cujvm7h.mongodb.net/supernova-auth
JWT_SECRET=35ccb2bdc923e8468fe76e4d844db08899aacf7d8e0d67df3801e6f36d0432c8
REDIS_HOST=redis-10818.crce217.ap-south-1-1.ec2.cloud.redislabs.com
REDIS_PORT=10818
REDIS_PASSWORD=ngElXvxgYOLn9Z68Bm450TDG4yZDdcT3
```

## Installation
1. Clone the repository.
2. Navigate to the `auth` directory.
3. Install dependencies:
   ```bash
   npm install
   ```

## Scripts
- `npm run dev`: Start the development server with `nodemon`.
- `npm start`: Start the production server.
- `npm test`: Run tests using Jest.
- `npm run test:watch`: Run tests in watch mode.

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