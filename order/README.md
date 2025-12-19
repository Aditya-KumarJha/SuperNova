# Order Microservice

The Order microservice is responsible for managing orders. It provides endpoints for creating, updating, and retrieving orders.

## Features
- Create and update orders
- Retrieve order details
- Cancel orders

## Environment Variables
The following environment variables are required to run this service:

```env
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
```

## Installation
1. Clone the repository.
2. Navigate to the `order` directory.
3. Install dependencies:
   ```bash
   npm install
   ```

## Scripts
- `npm run dev`: Start the development server with `nodemon`.
- `npm start`: Start the production server.
- `npm test`: Run tests using Jest.

## Testing
Jest is used for testing. Test files are located in the `tests` directory.

## Dependencies
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