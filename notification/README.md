# Notification Microservice

The Notification microservice is responsible for sending transactional emails triggered by events from other services (e.g., Auth, Payment, Product, and Order). It listens to RabbitMQ queues and sends rich HTML emails using Nodemailer.

## Features
- Listens to RabbitMQ queues for domain events
- Sends welcome emails on user registration
- Sends security alerts on user login
- Sends payment success and failure notifications
- Sends product creation, update, and deletion notifications
- Sends order cancellation notifications
- Centralized email sending using Nodemailer
- **Health Check Endpoint**: Provides a health check endpoint at `/` to verify the service status.
- **RabbitMQ Integration**:
  - Subscribes to the following queues:
    - `AUTH_NOTIFICATION.USER_CREATED`: Sends welcome emails to new users.
    - `AUTH_NOTIFICATION.USER_LOGGED_IN`: Sends security alerts for user logins.
    - `PAYMENT_NOTIFICATION.PAYMENT_COMPLETED`: Sends payment success notifications.
    - `PAYMENT_NOTIFICATION.PAYMENT_FAILED`: Sends payment failure notifications.
    - `PAYMENT_NOTIFICATION.PAYMENT_INITIATED`: Sends payment initiation notifications.
    - `PRODUCT_NOTIFICATION.PRODUCT_CREATED`: Sends product creation confirmation emails.
    - `PRODUCT_NOTIFICATION.PRODUCT_UPDATED`: Sends product update confirmation emails.
    - `PRODUCT_NOTIFICATION.PRODUCT_DELETED`: Sends product deletion confirmation emails.
    - `ORDER_NOTIFICATION.ORDER_CANCELLED`: Sends order cancellation notifications.
- **Inter-Service Communication**:
  - Processes events from `auth`, `payment`, `product`, and `order` services to send transactional emails.

## Environment Variables
The following environment variables are required to run this service:

```env
RABBITMQ_URL=YOUR_RABBITMQ_CONNECTION_URL
EMAIL_USER=YOUR_GMAIL_ADDRESS
CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
CLIENT_SECRET=YOUR_GOOGLE_OAUTH_CLIENT_SECRET
REFRESH_TOKEN=YOUR_GOOGLE_OAUTH_REFRESH_TOKEN
```

## Installation
### Clone the Repository
```bash
git clone https://github.com/Aditya-KumarJha/SuperNova.git
```

### Navigate to the `notification` Directory
```bash
cd notification
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

## How It Works
- The service connects to RabbitMQ using the URL from `RABBITMQ_URL`.
- It subscribes to the following queues:
  - `AUTH_NOTIFICATION.USER_CREATED`
  - `AUTH_NOTIFICATION.USER_LOGGED_IN`
  - `PAYMENT_NOTIFICATION.PAYMENT_COMPLETED`
  - `PAYMENT_NOTIFICATION.PAYMENT_FAILED`
  - `PAYMENT_NOTIFICATION.PAYMENT_INITIATED`
  - `PRODUCT_NOTIFICATION.PRODUCT_CREATED`
  - `PRODUCT_NOTIFICATION.PRODUCT_UPDATED`
  - `PRODUCT_NOTIFICATION.PRODUCT_DELETED`
  - `ORDER_NOTIFICATION.ORDER_CANCELLED`
- For each message, it builds a context-aware HTML template and sends an email using the SMTP transport configured in `src/email.js`.

## Endpoints
### GET /
- **Description**: Health check endpoint to verify that the service is running.
- **Response**: `{ message: 'Notification service is running' }`

## Dependencies
- `amqplib`
- `dotenv`
- `express`
- `mongoose` (reserved for future persistence if needed)
- `nodemailer`

## Notes
- This service does not expose public APIs beyond a basic health check; it is primarily event-driven via RabbitMQ.
- Make sure your Google account and OAuth credentials are configured to allow sending emails via Nodemailer.
