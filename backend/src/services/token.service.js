/**
 * This file defines the TokenService, 
 * which handles token creation, validation, invalidation, 
 * and cleanup for authentication and other purposes.
 * 
 * Author: Ahmed Aredah
 */

import { v4 as uuidv4 } from 'uuid';
import { TokenModel } from '../models/tokens.model.js';
import jwt from 'jsonwebtoken';

class TokenService {
    #tokenCache = new Map();
    #cacheTTL = 5 * 60 * 1000; // 5 minutes

    // Token expiration times in milliseconds
    #expirationTimes = {
        'auth': 24 * 60 * 60 * 1000, // 24 hours
        'resetPassword': 1 * 60 * 60 * 1000, // 1 hour
        'emailVerification': 24 * 60 * 60 * 1000 // 24 hours
    };

    generateJWT(userId, type) {
        return jwt.sign(
            { userId, type },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
    }

    async createToken(userId, type, deviceInfo) {        
        // Remove expired tokens
        await TokenModel.deleteMany({ userId, type, expiresAt: { $lt: new Date() } });
    
        // Find an existing active token
        const existingToken = await TokenModel.findOne({
            userId,
            type,
            isValid: true,
            expiresAt: { $gt: new Date() }
        });
    
        if (existingToken) {    
            // Return a new JWT with the same reference token
            return this.generateJWT(userId, type, existingToken.token);
        }
    
        const { jwtToken } = await this.createNewToken(userId, type, deviceInfo);
        return jwtToken;
    }
    

    async createNewToken(userId, type, deviceInfo) {    
        // Generate a reference token (UUID)
        const referenceToken = uuidv4();
    
        // Generate JWTwithout reference token
        const jwtToken = this.generateJWT(userId, type);
    
        const expiresAt = new Date(Date.now() + this.#expirationTimes[type]);
    
        try {
            await TokenModel.deleteMany({ userId, type });
    
            const tokenDoc = await TokenModel.create({
                userId,
                type,
                token: referenceToken,  // Storing reference token (UUID)
                expiresAt,
                device: deviceInfo
            });
    
            return { jwtToken, tokenDoc };
        } catch (error) {
            console.error("Error saving reference token to DB:", error);
            throw error;
        }
    }
    
    

    async validateToken(token, type) {
    
        try {
            // Decode JWT to extract userId and type
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
            // Query the database by `userId` instead of `referenceToken`
            const tokenDoc = await TokenModel.findOne({
                userId: decoded.userId,
                type,
                isValid: true,
                expiresAt: { $gt: new Date() }
            });
        
            if (tokenDoc) {
                this.#tokenCache.set(token, {
                    userId: tokenDoc.userId,
                    expiresAt: tokenDoc.expiresAt,
                    timestamp: Date.now()
                });
    
                return tokenDoc;
            }
    
            return null;
        } catch (error) {
            console.error("JWT Verification Error:", error);
            return null;
        }
    }
    

    async invalidateToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
            // Instead of using referenceToken, invalidate by userId and type
            return TokenModel.updateMany(
                { userId: decoded.userId, type: decoded.type },
                { $set: { isValid: false } }
            );
        } catch (error) {
            return null;
        }
    }

    async invalidateUserTokens(userId, exceptTokenId) {
        for (const [token, data] of this.#tokenCache.entries()) {
        if (data.userId.toString() === userId.toString()) {
            this.#tokenCache.delete(token);
        }
        }
        
        return TokenModel.invalidateUserTokens(userId, exceptTokenId);
    }

    async cleanup() {    
        // Remove expired tokens from cache
        for (const [token, data] of this.#tokenCache.entries()) {
            if (Date.now() >= new Date(data.expiresAt).getTime()) {
                this.#tokenCache.delete(token);
            }
        }
    
        // Remove expired tokens from database
        return TokenModel.deleteMany({ expiresAt: { $lt: new Date() } });
    }
}

export const tokenService = new TokenService();