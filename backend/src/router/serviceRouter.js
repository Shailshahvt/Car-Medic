/**
 * This file defines the ServiceRouter, 
 * which handles routes for managing services, including 
 * public routes for retrieving services and admin routes for 
 * creating, updating, and deleting services.
 * 
 * Author: Ahmed Aredah
 */

import { Router } from 'express';
import ServiceController from '../controllers/serviceController.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

class ServiceRouter {
  path = '/services';
  router = Router();
  controller = new ServiceController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Public routes
    this.router.get(`${this.path}`, this.controller.getAllServices);
    this.router.get(`${this.path}/category/:category`, this.controller.getServicesByCategory);
    this.router.get(`${this.path}/search`, this.controller.searchServices);
    
    // Admin routes - require authentication and admin permissions
    this.router.post(`${this.path}`, verifyToken, isAdmin, this.controller.createService);
    this.router.put(`${this.path}/:serviceId`, verifyToken, isAdmin, this.controller.updateService);
    this.router.delete(`${this.path}/:serviceId`, verifyToken, isAdmin, this.controller.deleteService);
  }
}

export default ServiceRouter;