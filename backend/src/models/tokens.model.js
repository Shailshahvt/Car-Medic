/**
 * This file defines the Token model schema, 
 * representing tokens used for authentication, password resets, 
 * and email verification, along with utility methods for token management.
 * 
 * Author: Ahmed Aredah
 */

import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['auth', 'resetPassword', 'emailVerification'],
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }  // TTL index
  },
  lastUsedAt: Date,
  isValid: {
    type: Boolean,
    default: true,
    index: true
  },
  device: {
    userAgent: String,
    ip: String,
    deviceType: String,
    browser: String
  }
}, {
  collection: 'tokens',
  timestamps: true
});

TokenSchema.index({ userId: 1, type: 1, isValid: 1 });

// pre-save to makr sure expiresAt has value
TokenSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    const expirationMap = {
      'auth': 24 * 60 * 60 * 1000, // 24 hours
      'resetPassword': 1 * 60 * 60 * 1000, // 1 hour
      'emailVerification': 24 * 60 * 60 * 1000 // 24 hours
    };
    this.expiresAt = new Date(Date.now() + expirationMap[this.type]);
  }
  next();
});

// check if token is expired
TokenSchema.methods.isExpired = function() {
  return Date.now() >= this.expiresAt.getTime();
};

// Cleanup expired tokens in batches
TokenSchema.statics.cleanupExpiredTokens = async function(batchSize = 1000) {
  const now = new Date();
  return this.deleteMany({
    $or: [
      { expiresAt: { $lt: now } },
      { isValid: false }
    ]
  }).limit(batchSize);
};

// Validate token
TokenSchema.statics.validateToken = async function(token, type) {
  const tokenDoc = await this.findOne({
    token,
    type,
    isValid: true,
    expiresAt: { $gt: new Date() }
  }).select('userId expiresAt').lean();
  
  return tokenDoc;
};

// Invalidate all user tokens
TokenSchema.statics.invalidateUserTokens = async function(userId, exceptTokenId = null) {
  const query = { userId, isValid: true };
  if (exceptTokenId) {
    query._id = { $ne: exceptTokenId };
  }
  return this.updateMany(query, { $set: { isValid: false } });
};

export const TokenModel = mongoose.model('Token', TokenSchema);