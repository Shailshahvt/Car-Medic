/**
 * This file defines the Appointment model schema, 
 * representing appointments between clients and mechanics, 
 * including details such as status, type, timing, and vehicle information.
 * 
 * Author: Ahmed Aredah
 */

import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
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
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['scheduled', 'emergency'],
    default: 'scheduled'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  vehicle: {
    carModelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CarModel'
    },
    clientGarageId: mongoose.Schema.Types.ObjectId,
    mileageAtService: Number
  },
  totalCost: {
    type: Number,
    min: 0
  },
  notes: String,
  mechanicResponse: {
    message: String,
    responseDate: Date
  }
}, {
  collection: 'appointments',
  timestamps: true
});

export const AppointmentModel = mongoose.model('Appointment', AppointmentSchema);