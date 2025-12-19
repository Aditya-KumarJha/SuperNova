# Product Microservice

The Product microservice is responsible for managing product data. It provides endpoints for creating, updating, deleting, and retrieving product information.

## Features
- Create, update, and delete products
- Retrieve product details
- Image upload and management using ImageKit

## Environment Variables
The following environment variables are required to run this service:

```env
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
IMAGEKIT_PRIVATE_KEY=YOUR_PRIVATE_KEY
IMAGEKIT_PUBLIC_KEY=YOUR_PUBLIC_KEY
IMAGEKIT_URL_ENDPOINT=YOUR_URL_ENDPOINT
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Aditya-KumarJha/SuperNova.git
   ```
2. Navigate to the `product` directory:
   ```bash
   cd product
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Scripts
- `npm run dev`: Start the development server with `nodemon`.
- `npm start`: Start the production server.
- `npm test`: Run tests using Jest.

## Endpoints
### POST /products
- **Description**: Create a new product.
- **Request Body**: `{ name, price, description, image }`
- **Response**: `201 Created`

### PATCH /products/:productId
- **Description**: Update product details.
- **Request Body**: `{ name, price, description }`
- **Response**: `200 OK`

### DELETE /products/:productId
- **Description**: Delete a product.
- **Response**: `200 OK`

### GET /products
- **Description**: Retrieve all products.
- **Response**: `200 OK`

### GET /products/:productId
- **Description**: Retrieve a product by ID.
- **Response**: `200 OK`

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