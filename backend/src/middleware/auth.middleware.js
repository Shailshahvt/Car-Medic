/**
 * This file contains middleware functions for authentication and authorization, 
 * including token verification, admin checks, mechanic admin checks, 
 * and resource ownership validation.
 * 
 * Author: Ahmed Aredah
 */

import jwt from 'jsonwebtoken';
import { tokenService } from '../services/token.service.js';
import { UserModel } from '../models/users.model.js';
import { MechanicModel } from '../models/mechanics.model.js';

// Verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(' ')[1];
        
        // Remove any extra quotes that might be wrapping the token string
        if (token) {
            token = token.replace(/^"|"$/g, '');
        }
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Check if token exists in database and is valid
        const tokenDoc = await tokenService.validateToken(token, 'auth');

        if (!tokenDoc) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Verify JWT signature and expiration
        const verifiedPayload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verifiedPayload;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

// Check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.userId);
        
        if (user.type !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error checking admin status' });
    }
};

// Check if user is a mechanic admin
const isMechanicAdmin = async (req, res, next) => {
    try {
        const mechanicId = req.params.mechanicId || req.body.mechanicId;
        
        if (!mechanicId) {
            return res.status(400).json({ message: 'Mechanic ID required' });
        }

        const mechanic = await MechanicModel.findOne({
            _id: mechanicId,
            'admins.userId': req.user.userId
        });

        if (!mechanic) {
            return res.status(403).json({ message: 'Not authorized for this mechanic shop' });
        }

        // Add mechanic admin role to request
        const adminRole = mechanic.admins.find(admin => 
            admin.userId.toString() === req.user.userId
        ).role;
        req.mechanicAdminRole = adminRole;
        
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error checking mechanic admin status' });
    }
};

// Check if user owns the resource
const isResourceOwner = async (req, res, next) => {
    try {
        const resourceUserId = req.params.userId || req.body.userId;
        
        if (resourceUserId !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to access this resource' });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error checking resource ownership' });
    }
};

export { verifyToken, isAdmin, isMechanicAdmin, isResourceOwner };