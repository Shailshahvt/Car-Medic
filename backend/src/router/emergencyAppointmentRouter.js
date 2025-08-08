/**
 * This file defines the EmergencyAppointmentRouter, 
 * which handles routes related to emergency appointments, 
 * including creation, retrieval, and status updates.
 * 
 * Author: Ahmed Aredah
 */

import { Router } from 'express';
import EmergencyAppointmentController from '../controllers/emergencyAppointmentController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

class EmergencyAppointmentRouter {
    path = '/emergency-appointments';
    router = Router();
    controller = new EmergencyAppointmentController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(`${this.path}/create`, verifyToken, this.controller.createEmergencyAppointment);
        this.router.get(`${this.path}/user`, verifyToken, this.controller.getUserEmergencyAppointments);
        this.router.get(`${this.path}/mechanic/:mechanicId`, verifyToken, this.controller.getMechanicEmergencyAppointments);
        this.router.post(`${this.path}/nearby-mechanics`, verifyToken, this.controller.findNearbyMechanicsForEmergency);
        
        // We can reuse the status update endpoints from the regular appointment router
        this.router.patch(
            `${this.path}/:appointmentId/status`,
            verifyToken,
            this.controller.updateAppointmentStatus
        );
    }
}

export default EmergencyAppointmentRouter;