/**
 * This file serves as the entry point for the CarMedic backend application. 
 * It establishes a connection to the database, initializes scheduled jobs, 
 * and starts the Express server with the configured routers.
 * 
 * Author: Ahmed Aredah
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
  AuthRouter,
  UserRouter,
  MechanicRouter,
  AppointmentRouter,
  ReviewRouter
} from './src/router/index.js';
import App from './src/app.js';
import { initScheduledJobs } from './src/jobs/scheduled.jobs.js';

dotenv.config(); // Load env variables
const mongoURI = process.env.MONGO_URI.replace("<password>", process.env.MONGO_PASSWORD);


// Database connection function
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,  // Needed for Azure CosmosDB
      tlsAllowInvalidCertificates: false,
    });

    console.log('✅ Connected to Azure CosmosDB MongoDB API successfully');

    // Initialize scheduled jobs
    initScheduledJobs();

    // Initialize the Express app
    const app = new App([
      new AuthRouter(),
      new UserRouter(),
      new MechanicRouter(),
      new AppointmentRouter(),
      new ReviewRouter()
  ]);

    app.listen();

  } catch (error) {
    console.error('❌ Unable to connect to MongoDB:', error);
    process.exit(1); // Exit the application on failure
  }
};

// Start the database connection
connectDB();
