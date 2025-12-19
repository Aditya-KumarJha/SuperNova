# Cart Microservice

The Cart microservice is responsible for managing user carts. It provides endpoints for adding, updating, and removing items from the cart.

## Features
- Add items to the cart
- Update item quantities
- Remove items from the cart
- Retrieve cart details

## Environment Variables
The following environment variables are required to run this service:

```env
MONGODB_URI=mongodb+srv://adikumarjha12:ImYNWTStwlngXfZY@cluster0.cujvm7h.mongodb.net/supernova-cart
JWT_SECRET=35ccb2bdc923e8468fe76e4d844db08899aacf7d8e0d67df3801e6f36d0432c8
```

## Installation
1. Clone the repository.
2. Navigate to the `cart` directory.
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