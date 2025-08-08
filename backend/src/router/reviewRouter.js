/**
 * This file defines the ReviewRouter, 
 * which handles routes related to creating, updating, deleting, 
 * and retrieving reviews, as well as fetching review statistics for mechanics.
 * 
 * Author: Ahmed Aredah
 */

import { Router } from 'express';
import ReviewController from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

class ReviewRouter {
    path = '/reviews';
    router = Router();
    controller = new ReviewController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(`${this.path}/mechanic/:mechanicId`, verifyToken, this.controller.createReview);
        this.router.put(`${this.path}/:reviewId`, verifyToken, this.controller.updateReview);
        this.router.delete(`${this.path}/:reviewId`, verifyToken, this.controller.deleteReview);
        this.router.get(`${this.path}/mechanic/:mechanicId`, this.controller.getMechanicReviews);
        this.router.get(`${this.path}/mechanic/:mechanicId/stats`, this.controller.getMechanicReviewStats);
    }
}

export default ReviewRouter;