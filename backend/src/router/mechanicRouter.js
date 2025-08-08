/**
 * This file defines the MechanicRouter, 
 * which handles routes related to mechanic shop management, 
 * schedule management, service management, and nearby mechanic retrieval.
 * 
 * Author: Ahmed Aredah
 */

import { Router } from 'express';
import MechanicController from '../controllers/mechanicController.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { hasPermission } from '../middleware/permission.middleware.js';
import { PermissionEnum } from '../enums/permissions.enum.js';

class MechanicRouter {
    path = '/mechanics';
    router = Router();
    controller = new MechanicController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Mechanic shop management
        this.router.post(`${this.path}/create`, verifyToken, this.controller.createMechanic);
        this.router.post(`${this.path}/:mechanicId/transfer-ownership`, verifyToken, this.controller.transferOwnership);
        this.router.get(`${this.path}/by-service`, this.controller.getMechanicsByServiceName);

        
        // Schedule management
        this.router.post(
            `${this.path}/:mechanicId/slots`,
            verifyToken,
            hasPermission(PermissionEnum.MANAGE_SCHEDULE),
            this.controller.createSlots
        );
        this.router.get(`${this.path}/:mechanicId/slots`, this.controller.getAvailableSlots);
        
        // // Service management
        this.router.post(
            `${this.path}/:mechanicId/services`,
            verifyToken,
            hasPermission(PermissionEnum.MANAGE_SERVICES),
            this.controller.addService
        );

        // Get mechanics
        this.router.get(`${this.path}/nearby`, this.controller.getMechanicsByDistance);
    }
}

export default MechanicRouter;