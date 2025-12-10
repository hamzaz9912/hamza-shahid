# Backend API

This is the backend API for the Hamza & Shahid Co. application, built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in `.env` file

3. Seed the database with initial data:
   ```bash
   npm run seed
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Trips
- `GET /api/trips` - Get all trips
- `GET /api/trips/:id` - Get single trip
- `POST /api/trips` - Create new trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Parties
- `GET /api/parties` - Get all parties
- `GET /api/parties/:id` - Get single party
- `POST /api/parties` - Create new party
- `PUT /api/parties/:id` - Update party
- `DELETE /api/parties/:id` - Delete party

### Brokers
- `GET /api/brokers` - Get all brokers
- `GET /api/brokers/:id` - Get single broker
- `POST /api/brokers` - Create new broker
- `PUT /api/brokers/:id` - Update broker
- `DELETE /api/brokers/:id` - Delete broker

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get single payment
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)