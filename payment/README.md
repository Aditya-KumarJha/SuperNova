# Payment Microservice

The Payment microservice is responsible for handling payment processing and verification. It provides endpoints for creating and verifying payments.

## Features
- Payment creation
- Payment verification
- Secure payment handling

## Environment Variables
The following environment variables are required to run this service:

```env
MONGODB_URI=YOUR_MONGODB_URI
PAYMENT_SECRET=YOUR_PAYMENT_SECRET
PAYMENT_API_KEY=YOUR_PAYMENT_API_KEY
```

## Installation
### Clone the Repository
```bash
git clone https://github.com/Aditya-KumarJha/SuperNova.git
```

### Navigate to the `payment` Directory
```bash
cd payment
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
### POST /create-payment
- **Description**: Create a new payment.
- **Request Body**: `{ amount, currency, paymentMethod }`
- **Response**: `201 Created`

### POST /verify-payment
- **Description**: Verify a payment.
- **Request Body**: `{ paymentId, signature }`
- **Response**: `200 OK`

## Testing
Jest is used for testing. Test files are located in the `tests` directory.

## Dependencies
- `dotenv`
- `express`
- `mongoose`
- `payment-sdk`

## Dev Dependencies
- `jest`
- `supertest`

## Jest Configuration
```javascript
/** @type {import('jest').Config} */

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup/globalSetup.js'],
    collectCoverageFrom: ['src/**/*.js', '!src/**/index.js'],
    verbose: true,
};
```