/**
 * This file defines the Review model schema, 
 * representing reviews left by clients for mechanics, 
 * including ratings, comments, and service details.
 * 
 * Author: Ahmed Aredah
 */

import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  mechanicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mechanic',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: 1000
  },
  verified: {
    type: Boolean,
    default: false
  },
  serviceReceived: {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    serviceName: String
  }
}, {
  collection: 'reviews',
  timestamps: true
});

export const ReviewModel = mongoose.model('Review', ReviewSchema);