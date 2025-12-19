# Order Microservice

The Order microservice is responsible for managing orders. It provides endpoints for creating, updating, and retrieving orders.

## Features
- Create and update orders
- Retrieve order details
- Cancel orders

## Environment Variables
The following environment variables are required to run this service:

```env
MONGODB_URI=mongodb+srv://adikumarjha12:ImYNWTStwlngXfZY@cluster0.cujvm7h.mongodb.net/supernova-order
JWT_SECRET=35ccb2bdc923e8468fe76e4d844db08899aacf7d8e0d67df3801e6f36d0432c8
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