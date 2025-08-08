/**
 * This file defines the AppointmentRouter, 
 * which handles routes related to appointment creation, 
 * retrieval, and status updates.
 * 
 * Author: Ahmed Aredah
 */

import { Router } from 'express';
import AppointmentController from '../controllers/appointmentController.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { hasPermission } from '../middleware/permission.middleware.js';
import { PermissionEnum } from '../enums/permissions.enum.js';

class AppointmentRouter {
    path = '/appointments';
    router = Router();
    controller = new AppointmentController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(`${this.path}/create`, verifyToken, this.controller.createAppointment);
        this.router.post(`${this.path}/book`, verifyToken, this.controller.createAppointment);
        this.router.get(`${this.path}/user`, verifyToken, this.controller.getUserAppointments);
        this.router.get(`${this.path}/mechanic/:mechanicId`, verifyToken, this.controller.getMechanicAppointments);
        this.router.patch(
            `${this.path}/:appointmentId/status`,
            verifyToken,
            hasPermission(PermissionEnum.MANAGE_APPOINTMENTS),
            this.controller.updateAppointmentStatus
        );
    }
}

export default AppointmentRouter;