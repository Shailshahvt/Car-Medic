# CarMedic Backend API

*This File is written with the help of Generative AI*

## Overview
CarMedic is a web application that connects car owners with mechanics. This repository contains the backend API that powers the CarMedic platform, built with Node.js, Express, and MongoDB (hosted on Azure CosmosDB).

## Features
- User authentication and authorization
- Mechanic shop management
- Appointment scheduling
- Review and rating system
- Vehicle management for users

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- NPM or Yarn
- MongoDB account (we're using Azure CosmosDB)
- Email service credentials (we're using Mailtrap for development)

### Installation

1. Clone this repository:
```bash
git clone https://github.com/Car-Medic/CarMedic.git
cd carmedic-backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the Server:

```bash
npm run dev  # For development
```

## API Documentation
### Authentication

#### Register a New User

```http
POST /auth/signup
```

Body:

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "YourPassword123!",
    "type": "customer"  // or "mechanic" or "admin"
}
```

#### Login

```http
POST /auth/login
```

```json
{
    "email": "john@example.com",
    "password": "YourPassword123!"
}
```

### Mechanic Management

#### Create a Mechanic Shop

```http
POST /mechanics/create
```

```json
{
    "businessName": "John's Auto Repair",
    "hourlyRate": 50,
    "location": {
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "coordinates": {
            "latitude": 40.7128,
            "longitude": -74.0060
        }
    }
}
```

#### Create Available Slots

```http
POST /mechanics/:mechanicId/slots
```

```json
{
    "date": "2025-02-15",
    "slots": [
        {
            "startTime": "2025-02-15T09:00:00",
            "endTime": "2025-02-15T10:00:00"
        }
    ]
}
```

### Appointments Management

#### Book an Appointment

```http
POST /appointments/create
```

```json
{
    "mechanicId": "mechanic_id",
    "serviceId": "service_id",
    "startTime": "2025-02-15T09:00:00",
    "vehicleId": "vehicle_id"
}
```

### Reviews Management

#### Create a Review

```http
POST /reviews/mechanic/:mechanicId
```

```json
{
    "appointmentId": "appointment_id",
    "rating": 5,
    "review": "Great service!"
}
```

## Project Structure

carmedic-backend/
├── src/
│   ├── controllers/        # Main logic
│   ├── models/            # Database models
│   ├── router/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/            # Helper functions
│   ├── enums/            # Enumerations
│   └── app.js            # Express app setup
├── .env                  # Environment variables
└── server.js            # Entry point

## Authentication Flow

1. User registers with email/password
2. Verification email is sent
3. User verifies email
4. User can log in
5. JWT token is provided
6. Token must be included in Authorization header for protected routes

## Database Collections

- Users (customers, mechanics, admins)
- Mechanics (shop information)
- Appointments
- Reviews
- Tokens (for authentication)
- CarModels (vehicle information)

## Error Handling

```json
{
    "message": "Error description",
    "error": "Detailed error message (development only)"
}
```

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Email verification
- Token invalidation on logout
- Role-based access control
- Request validation

## Development

- Use `npm run dev` to start development server with nodemon
- All API responses follow standard HTTP status codes
- Validation is performed on all inputs
- Error handling is consistent across all endpoints

## Known Issues

None currently

## Support

Reach out to Ahmed Aredah