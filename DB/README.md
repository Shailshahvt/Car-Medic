# CAR-MEDIC Database Database Documentation

*This File is written with the help of Generative AI*
Author: Ahmed Aredah

## Overview

This database is designed for a mechanic booking system where customers can find mechanics, book appointments, and leave reviews. The system is built using MongoDB (through Azure CosmosDB) and consists of several collections that work together.
Database Setup

## Create a CosmosDB account on Azure

1. Choose the MongoDB API
2. Create a new database
3. Create the collections listed below

## Collections Overview
### 1. Users Collection

This collection stores all user information, whether they're customers, mechanics, or administrators.

#### Important Fields:

- firstName, lastName: The user's full name
- email: User's email address (must be unique)
- password: Encrypted password (never store plain text!)
- type: Can be 'customer', 'mechanic', or 'admin'
- verified: Whether the user's account is verified
- garage: Only for customers - list of cars they own
  - Each car has basic info like license plate, color, year
  - Includes maintenance history for each car


### 2. Mechanics Collection

Stores information about mechanic shops/services.

#### Important Fields:

- businessName: Name of the mechanic shop
- admins: List of users who can manage this mechanic shop
  - Each admin has a role (owner/manager/staff)
  - Tracks who added them and when
- hourlyRate: How much they charge per hour
- services: What services they offer
  - Each service has a name, description, duration, and price
- schedule: Their availability calendar
  - Shows which time slots are available/booked
- appointmentHistory: Record of all appointments
  - Tracks status, completion date, and money earned



### 3. Appointments Collection

Records all booking appointments between customers and mechanics.

#### Important Fields:

- mechanicId: Which mechanic shop
- clientId: Which customer
- status: Current state of appointment
  - Can be: pending, accepted, rejected, completed, cancelled
- startTime & endTime: When the appointment is scheduled
- mechanicResponse: Message from mechanic when accepting/rejecting
- vehicle: Which car is being serviced

### 4. Car Models Collection

Database of car makes and models.

#### Important Fields:

- make: Car manufacturer (e.g., Toyota)
- model: Specific model (e.g., Camry)
- year: Manufacturing year
- type: Body type (sedan, SUV, etc.)
- specifications: Technical details about the car

### 5. Reviews Collection

Customer reviews for mechanics.

#### Important Fields:

- mechanicId: Which mechanic shop
- clientId: Who wrote the review
- rating: 1-5 stars
- review: Written feedback
- verified: Confirms review is from real appointment. TODO: We provide legit reviews only so we can consider removing this feature. We can give the mechanic the option to retrieve the google maps reviews or not.

### 6. Tokens Collection

Manages user login and security.

#### Important Fields:

- userId: Which user the token belongs to
- type: Purpose of token (login, password reset, etc.)
- token: The actual security token
- expiresAt: When the token becomes invalid
- device: Information about the device used

## Basic Flow Examples

### Customer Books Appointment:

1. Customer logs in (creates token for login)
2. Views mechanic's schedule
3. Creates appointment (status = pending)
4. Mechanic gets notified
5. Mechanic accepts/rejects with message
6. If accepted, slot becomes unavailable
7. After service, customer can leave review

### Mechanic Manages Schedule:

1. Mechanic admin logs in (creates token for login)
2. Views pending appointments
3. Accepts/rejects appointments
4. Updates their available time slots
5. Views appointment history