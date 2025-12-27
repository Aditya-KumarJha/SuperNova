# AI Buddy Microservice

This microservice supports containerization and cloud deployment. It includes a `Dockerfile` and `.dockerignore` for building Docker images, and can be deployed to AWS ECS, ECR, or other container services.

The AI Buddy microservice provides an AI-powered assistant that can help users search for products and add them to their cart via a real-time Socket.IO connection. It orchestrates LLM tools to talk to other SuperNova microservices (like `product` and `cart`).

## Features
- Real-time conversational interface over WebSockets (Socket.IO)
- Uses Google Gemini via LangChain for AI reasoning
- Tool-based integration with Product and Cart microservices
- JWT-based authentication over WebSocket handshake (via cookies)

## Containerization & Cloud Deployment
- **Docker Support**: Includes a `Dockerfile` and `.dockerignore` for building efficient container images.
- **AWS Deployment**: Service can be deployed to AWS using ECS, ECR, or EC2. Update environment variables in your AWS environment or use AWS Secrets Manager/Parameter Store for sensitive data.

### Build & Run with Docker
```bash
docker build -t ai-buddy-service .
docker run --env-file .env -p 4005:4005 ai-buddy-service
```

### Example AWS Deployment Steps
1. Build Docker image and tag for ECR:
  ```bash
  aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
  docker build -t ai-buddy-service .
  docker tag ai-buddy-service:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/ai-buddy-service:latest
  docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/ai-buddy-service:latest
  ```
2. Deploy the image using AWS ECS, EC2, or other container orchestration services.
3. Set environment variables in your AWS task definition or EC2 instance.

### .dockerignore
Ensure you have a `.dockerignore` file to exclude unnecessary files from the Docker build context (e.g., `node_modules`, `__tests__`, `test`, `*.log`).

## Environment Variables
The following environment variables are required to run this service:

```env
PORT=4005
JWT_SECRET=YOUR_JWT_SECRET
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
```

> Note: `JWT_SECRET` must match the value used by the other SuperNova services that issue tokens.

## Installation
### Clone the Repository
```bash
git clone https://github.com/Aditya-KumarJha/SuperNova.git
cd SuperNova/ai-buddy
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

## Architecture & Flow
- `server.js` creates an HTTP server from `src/app.js` and initializes Socket.IO via `initSocketServer`.
- `src/sockets/socket.server.js`:
  - Authenticates each socket connection using the `token` cookie (JWT).
  - On each `message` event from the client, forwards the user message to the LangGraph agent.
  - Emits the AI assistant's reply back to the client as a `message` event.
- `src/agents/agent.js`:
  - Defines a LangGraph `StateGraph` using `@langchain/langgraph` and `@langchain/google-genai`.
  - Uses the Gemini model (`gemini-2.5-flash`) with tools enabled.
  - If the model requests tools, the graph runs the corresponding tool node(s) and loops back to chat.
- `src/agents/tool.js`:
  - `searchProduct`: calls the Product service (`http://localhost:4001/api/products`) with the user's query.
  - `addProductToCart`: calls the Cart service (`http://localhost:4002/api/cart/items`) to add an item with a given `productId` and optional `qty`.

Both tools expect a valid JWT `token` (passed via metadata from the socket layer) and forward it as a `Bearer` token to downstream services.

## Socket.IO Usage
From a frontend, you can connect to AI Buddy like this (pseudo-code):

```js
import { io } from "socket.io-client";

// Ensure `token` cookie is already set by the Auth service
const socket = io("http://localhost:4005", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected to AI Buddy");

  // Send a message to the assistant
  socket.emit("message", "Find me a red t-shirt under $30 and add it to my cart.");
});

socket.on("message", (reply) => {
  console.log("AI Buddy:", reply);
});

socket.on("disconnect", () => {
  console.log("Disconnected from AI Buddy");
});
```

## Dependencies
- `@langchain/core`
- `@langchain/google-genai`
- `@langchain/langgraph`
- `axios`
- `cookie-parser`
- `dotenv`
- `express`
- `jsonwebtoken`
- `mongoose`
- `socket.io`
- `zod`

## .dockerignore Example
```
node_modules
test
__tests__
*.log
Dockerfile
.env
```

## Notes
- This service depends on the `product` and `cart` microservices being available at `http://localhost:4001` and `http://localhost:4002` respectively.
- The Auth service must issue JWT tokens and set them in a `token` cookie for WebSocket authentication to succeed.
- Make sure `GOOGLE_API_KEY` has access to the `gemini-2.5-flash` model as configured in `src/agents/agent.js`.

## Additional Notes
- **Security**: Use strong secrets and secure your environment variables, especially in production/cloud environments.
- **Broker Pattern**: Uses a broker for inter-service communication via HTTP and WebSocket.
