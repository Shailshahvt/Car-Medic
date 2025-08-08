# CarMedic - Car Service Appointment System (Minimum Viable Product)

*Created with the help of AI*

CarMedic is a full-stack web application that connects car owners with mechanic shops, allowing users to schedule and manage car service appointments easily.

## Features

- **User Authentication**
  - Registration and login system
  - Password reset functionality
  - Email verification
  - Session management across devices

- **Customer Features**
  - Add and manage vehicles in garage
  - Schedule service appointments
  - View appointment history
  - Submit and manage reviews
  - Track service history

- **Mechanic Shop Features**
  - Create and manage shop profile
  - Set availability and schedule
  - Manage service offerings
  - Handle appointment requests
  - View customer reviews

- **Admin Features**
  - User management
  - Shop verification
  - System monitoring

## Tech Stack

### Frontend
- React.js
- Chakra UI
- React Router
- Axios
- Formik
- Day.js

### Backend
- Node.js
- Express.js
- MongoDB (Azure CosmosDB)
- JWT Authentication
- Nodemailer
- bcrypt

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (if running locally) or Azure CosmosDB account

## Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd CarMedic
```

## Installation

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
# Development mode
npm start

# Build for production
npm run build
```

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```
The server should start at `http://localhost:5001/`

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Database models
│   │   ├── router/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── enums/          # Enums and constants
│   └── server.js           # Entry point
└── frontend/
    ├── public/             # Static files
    └── src/
        ├── pages/          # React components
        ├── services/       # API services
        └── utils/          # Utility functions
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check-email/:email` - Check email availability

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/garage/add` - Add vehicle to garage
- `DELETE /api/users/garage/:vehicleId` - Remove vehicle from garage

### Mechanics
- `POST /api/mechanics/create` - Create mechanic shop
- `POST /api/mechanics/:mechanicId/slots` - Create availability slots
- `GET /api/mechanics/:mechanicId/slots` - Get available slots
- `POST /api/mechanics/:mechanicId/services` - Add service

### Appointments
- `POST /api/appointments/create` - Create appointment
- `GET /api/appointments/user` - Get user appointments
- `GET /api/appointments/mechanic/:mechanicId` - Get mechanic appointments
- `PATCH /api/appointments/:appointmentId/status` - Update appointment status

### Reviews
- `POST /api/reviews/mechanic/:mechanicId` - Create review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review
- `GET /api/reviews/mechanic/:mechanicId` - Get mechanic reviews
- `GET /api/reviews/mechanic/:mechanicId/stats` - Get review statistics

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make changes and commit (`git commit -am 'Add new feature'`), It is prefered to sign your commit using -S.
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request
