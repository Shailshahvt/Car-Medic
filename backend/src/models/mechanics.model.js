/**
 * This file defines the Mechanic model schema, 
 * representing mechanic shop details such as business information, 
 * services offered, schedule, location, and appointment history.
 * 
 * Author: Ahmed Aredah
 */

import mongoose from 'mongoose';

const MechanicSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    maxlength: 100
  },
  admins: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'manager', 'staff'],
      required: true
    },
    permissions: [String],
    addedAt: {
      type: Date,
      default: Date.now
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  experience: {
    type: Number,
    min: 0
  },
  specializations: [String],
  services: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    estimatedDuration: {
      type: Number,
      required: true,
      min: 0
    },
    isEmergency: {
      type: Boolean,
      default: false
    },
    vehicleTypes: {
      type: [String],
      default: ['sedan', 'SUV', 'truck', 'hatchback', 'van', 'coupe']
    },
    additionalInfo: String
  }],
  supportedCars: [{
    carModelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CarModel'
    },
    specialNotes: String
  }],
  schedule: [{
    date: Date,
    slots: [{
      startTime: Date,
      endTime: Date,
      isAvailable: {
        type: Boolean,
        default: true
      },
      appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
      }
    }]
  }],

  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    }
  },
  appointmentHistory: [{
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    status: String,
    completedAt: Date,
    revenue: Number
  }]
}, {
  collection: 'mechanics',
  timestamps: true
});

export const MechanicModel = mongoose.model('Mechanic', MechanicSchema);