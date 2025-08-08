/**
 * This file defines the User model schema, 
 * representing user details such as personal information, 
 * account status, garage, and appointment history.
 * 
 * Author: Ahmed Aredah
 */

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },  
  firstName: {
    type: String,
    required: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100
  },
  phone: {
    type: String,
    maxlength: 20
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['customer', 'mechanic', 'admin'],
    required: true,
    default: 'customer'
  },
  verified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  },
  lastLoginAt: {
    type: Date
  },
  garage: [{
    carModelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CarModel'
    },
    licensePlate: String,
    color: String,
    year: Number,
    vin: String,
    purchaseYear: Number,
    mileage: Number,
    maintenanceHistory: [{
      date: Date,
      appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
      },
      serviceType: String,
      mileageAtService: Number
    }]
  }],
  appointmentHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }]
}, {
  collection: 'users',
  timestamps: true
});

export const UserModel = mongoose.model('User', UserSchema);