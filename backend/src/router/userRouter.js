/**
 * This file defines the UserRouter, 
 * which handles routes for user profile management, 
 * vehicle management, appointment cancellation, 
 * and admin-specific user management actions.
 * 
 * Author: Ahmed Aredah
 */

import { Router } from 'express';
import UserController from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

class UserRouter {
    path = '/users';
    router = Router();
    controller = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(`${this.path}/profile`, verifyToken, this.controller.getProfile);
        this.router.put(`${this.path}/profile`, verifyToken, this.controller.updateProfile);
        this.router.post(`${this.path}/garage/add`, verifyToken, this.controller.addVehicle);
        this.router.delete(`${this.path}/garage/:vehicleId`, verifyToken, this.controller.removeVehicle);
        this.router.patch(`${this.path}/appointments/:appointmentId/cancel`, verifyToken, this.controller.cancelAppointment);
        
        // Admin routes
        this.router.get(`${this.path}`, verifyToken, isAdmin, this.controller.getAllUsers);
        this.router.patch(`${this.path}/:userId/status`, verifyToken, isAdmin, this.controller.updateUserStatus);
    }
}

export default UserRouter;