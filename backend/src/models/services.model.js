/**
 * This file defines the Service model schema, 
 * representing services offered by mechanics, including details 
 * such as name, category, description, and popularity.
 * 
 * Author: Ahmed Aredah
 */

import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: String,
  popularity: {
    type: Number,
    default: 0
  }
}, {
  collection: 'services',
  timestamps: true
});

// Create text indexes for search
ServiceSchema.index({ name: 'text', description: 'text' });

export const ServiceModel = mongoose.model('Service', ServiceSchema);