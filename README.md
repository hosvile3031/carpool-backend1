# Carpool Backend API

A comprehensive backend API for a ride-sharing carpool platform built with Node.js, Express.js, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with secure registration and login
- **Driver Management**: Driver registration with vehicle information and document uploads
- **Payment Integration**: Paystack payment processing for ride bookings
- **Geolocation Services**: Google Maps integration for geocoding and directions
- **Ride Management**: Create, search, and book rides with real-time updates
- **Real-time Communication**: Socket.IO for live location tracking and notifications

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Paystack API
- **Maps**: Google Maps API
- **File Upload**: Multer
- **Real-time**: Socket.IO
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd carpool-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update the following variables with your actual values:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure secret for JWT tokens
     - `PAYSTACK_SECRET_KEY`: Your Paystack secret key
     - `PAYSTACK_PUBLIC_KEY`: Your Paystack public key
     - `GOOGLE_MAPS_API_KEY`: Your Google Maps API key

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login user | No |
| GET | `/profile` | Get current user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |
| POST | `/change-password` | Change user password | Yes |

### Driver Routes (`/api/driver`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register as a driver | Yes |
| GET | `/profile` | Get driver profile | Yes |
| PUT | `/profile` | Update driver profile | Yes |
| GET | `/verification-status` | Get verification status | Yes |
| GET | `/stats` | Get driver statistics | Yes |
| PUT | `/verify/:driverId` | Verify driver (Admin only) | Yes |

### Ride Routes (`/api/rides`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create a new ride | Yes |
| GET | `/` | Get available rides | Yes |
| GET | `/:rideId` | Get a single ride | Yes |
| PUT | `/:rideId/book` | Book a ride | Yes |

### Payment Routes (`/api/payments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/initialize` | Initialize payment | Yes |
| GET | `/verify/:reference` | Verify payment | Yes |

### Location Routes (`/api/location`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/geocode` | Geocode address to coordinates | Yes |
| GET | `/directions` | Get directions between locations | Yes |

## Example Usage

### 1. Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Register as a driver

```bash
curl -X POST http://localhost:3000/api/driver/register \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "licenseNumber": "ABC123456",
    "vehicle": {
      "make": "Toyota",
      "model": "Corolla",
      "year": 2020,
      "licensePlate": "XYZ-123",
      "color": "White"
    }
  }'
```

### 4. Create a ride

```bash
curl -X POST http://localhost:3000/api/rides \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {
      "address": "Lagos, Nigeria",
      "latitude": 6.5244,
      "longitude": 3.3792
    },
    "destination": {
      "address": "Abuja, Nigeria",
      "latitude": 9.0765,
      "longitude": 7.3986
    },
    "departureTime": "2024-01-15T10:00:00Z",
    "availableSeats": 3,
    "pricePerSeat": 5000
  }'
```

## Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS**: Configured for cross-origin requests
- **Helmet**: Sets various HTTP headers for security
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Account Lockout**: Protection against brute force attacks

## File Structure

```
carpool-backend/
├── models/           # Database models
├── routes/           # API routes
├── middleware/       # Custom middleware
├── services/         # Business logic services
├── utils/           # Utility functions
├── uploads/         # File uploads directory
├── server.js        # Main server file
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `PAYSTACK_SECRET_KEY` | Paystack secret key | Yes |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes |

## Testing

Run the server and test endpoints using tools like:
- **Postman**: For interactive API testing
- **cURL**: For command-line testing
- **Thunder Client**: VS Code extension for API testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
