# Product Microservice

The Product microservice is responsible for managing product data. It provides endpoints for creating, updating, deleting, and retrieving product information.

## Features
- Create, update, and delete products
- Retrieve product details
- Image upload and management using ImageKit

## Environment Variables
The following environment variables are required to run this service:

```env
MONGODB_URI=mongodb+srv://adikumarjha12:ImYNWTStwlngXfZY@cluster0.cujvm7h.mongodb.net/supernova-product
JWT_SECRET=35ccb2bdc923e8468fe76e4d844db08899aacf7d8e0d67df3801e6f36d0432c8
IMAGEKIT_PRIVATE_KEY="private_MHguiie5ysvCLll9Jb+tADPmQr0="
IMAGEKIT_PUBLIC_KEY="public_fdM2ci/Y/1GxSIjczaeWYkKN82I="
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/wl9xamwdr
```

## Installation
1. Clone the repository.
2. Navigate to the `product` directory.
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
- `cookie-parser`
- `dotenv`
- `express`
- `express-validator`
- `imagekit`
- `jsonwebtoken`
- `mongoose`
- `multer`
- `uuid`

## Dev Dependencies
- `cross-env`
- `jest`
- `mongodb-memory-server`
- `nodemon`
- `supertest`

## Jest Configuration
```javascript
{
  "testEnvironment": "node",
  "testMatch": [
    "**/tests/**/*.test.js"
  ]
}
```