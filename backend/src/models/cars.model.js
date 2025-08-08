/**
 * This file defines the CarModel schema, 
 * representing car details such as make, model, year, type, engine types, 
 * and additional specifications.
 * 
 * Author: Ahmed Aredah
 */

import mongoose from 'mongoose';

const CarModelSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['sedan', 'SUV', 'truck', 'hatchback', 'van', 'coupe']
  },
  engineTypes: [{
    type: String,
    enum: ['gasoline', 'diesel', 'electric', 'hybrid']
  }],
  specifications: {
    engineSize: String,
    transmission: [String],
    fuelType: [String]
  }
}, {
  collection: 'carModels',
  timestamps: true
});

export const CarModel = mongoose.model('CarModel', CarModelSchema);