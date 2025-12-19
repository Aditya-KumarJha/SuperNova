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
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Aditya-KumarJha/SuperNova.git
   ```
2. Navigate to the `cart` directory:
   ```bash
   cd cart
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