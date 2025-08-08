/**
 * This file defines the AuthRouter, 
 * which handles routes related to user authentication, 
 * including signup, login, logout, and email verification.
 * 
 * Author: Ahmed Aredah
 */

import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

class AuthRouter {
    path = '/auth';
    router = Router();
    controller = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(`${this.path}/signup`, this.controller.signup);
        this.router.post(`${this.path}/login`, this.controller.login);
        this.router.post(`${this.path}/logout`, verifyToken, this.controller.logout);
        this.router.post(`${this.path}/logout-all`, verifyToken, this.controller.logoutAll);
        this.router.get(`${this.path}/check-email/:email`, this.controller.checkEmail);
    }
}

export default AuthRouter;