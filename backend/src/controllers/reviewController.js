/**
 * ReviewController handles all operations related to reviews, 
 * including creating, updating, deleting reviews, and fetching review statistics.
 * 
 * Author: Ahmed Aredah
 */

import { ReviewModel } from '../models/reviews.model.js';
import { MechanicModel } from '../models/mechanics.model.js';
import { AppointmentModel } from '../models/appointments.model.js';
import { AppointmentStatusEnum } from '../enums/appointmentStatus.enum.js';

class ReviewController {
    constructor() {
        try {
            this.createReview = this.createReview.bind(this);
            this.updateReview = this.updateReview.bind(this);
            this.deleteReview = this.deleteReview.bind(this);
            this.getMechanicReviews = this.getMechanicReviews.bind(this);
            this.getMechanicReviewStats = this.getMechanicReviewStats.bind(this);
            this.validateRating = this.validateRating.bind(this);
            this.verifyAppointment = this.verifyAppointment.bind(this);
            this.checkExistingReview = this.checkExistingReview.bind(this);
            this.createNewReview = this.createNewReview.bind(this);
            this.updateMechanicRating = this.updateMechanicRating.bind(this);
            this.calculateReviewStats = this.calculateReviewStats.bind(this);
        } catch (error) {
            console.error("Error in constructor:", error);
            throw error;
        }
    }

    async createReview(req, res) {
        try {
            const { mechanicId } = req.params;
            const { appointmentId, rating, review } = req.body;
            const userId = req.user.userId;

            // Validate rating
            if (!this.validateRating(rating)) {
                return res.status(400).json({
                    message: 'Rating must be between 1 and 5'
                });
            }

            // Verify completed appointment
            const appointment = await this.verifyAppointment(appointmentId, mechanicId, userId);
            if (!appointment) {
                return res.status(400).json({
                    message: 'Can only review completed appointments'
                });
            }

            // Check for existing review
            const existingReview = await this.checkExistingReview(appointmentId, userId);
            if (existingReview) {
                return res.status(400).json({
                    message: 'You have already reviewed this appointment'
                });
            }

            // Create review
            const newReview = await this.createNewReview({
                mechanicId,
                userId,
                appointmentId,
                rating,
                review,
                appointment
            });

            // Update mechanic's rating
            await this.updateMechanicRating(mechanicId);

            return res.status(201).json({
                message: 'Review submitted successfully',
                review: newReview
            });
        } catch (error) {
            console.error("Error in createReview:", error);
            return res.status(500).json({
                message: 'Error creating review',
                error: error.message
            });
        }
    }

    async updateReview(req, res) {
        try {
            const { reviewId } = req.params;
            const { rating, review } = req.body;
            const userId = req.user.userId;

            // Validate rating
            if (!this.validateRating(rating)) {
                return res.status(400).json({
                    message: 'Rating must be between 1 and 5'
                });
            }

            // Find and update review
            const existingReview = await ReviewModel.findOne({
                _id: reviewId,
                clientId: userId
            });

            if (!existingReview) {
                return res.status(404).json({
                    message: 'Review not found'
                });
            }

            existingReview.rating = rating;
            existingReview.review = review;
            await existingReview.save();

            // Update mechanic's rating
            await this.updateMechanicRating(existingReview.mechanicId);

            return res.status(200).json({
                message: 'Review updated successfully',
                review: existingReview
            });
        } catch (error) {
            console.error("Error in updateReview:", error);
            return res.status(500).json({
                message: 'Error updating review',
                error: error.message
            });
        }
    }

    async deleteReview(req, res) {
        try {
            const { reviewId } = req.params;
            const userId = req.user.userId;

            const review = await ReviewModel.findOne({
                _id: reviewId,
                clientId: userId
            });

            if (!review) {
                return res.status(404).json({
                    message: 'Review not found'
                });
            }

            const mechanicId = review.mechanicId;
            await review.remove();

            // Update mechanic's rating
            await this.updateMechanicRating(mechanicId);

            return res.status(200).json({
                message: 'Review deleted successfully'
            });
        } catch (error) {
            console.error("Error in deleteReview:", error);
            return res.status(500).json({
                message: 'Error deleting review',
                error: error.message
            });
        }
    }

    async getMechanicReviews(req, res) {
        try {
            const { mechanicId } = req.params;
            const { page = 1, limit = 10, sort = 'newest' } = req.query;

            const sortOptions = {
                newest: { createdAt: -1 },
                oldest: { createdAt: 1 },
                highestRating: { rating: -1 },
                lowestRating: { rating: 1 }
            };

            const reviews = await ReviewModel.find({ mechanicId })
                .sort(sortOptions[sort])
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('clientId', 'firstName lastName')
                .populate('appointmentId', 'serviceName');

            const total = await ReviewModel.countDocuments({ mechanicId });

            return res.status(200).json({
                reviews,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                total
            });

        } catch (error) {
            console.error("Error in getMechanicReviews:", error);
            return res.status(500).json({
                message: 'Error fetching reviews',
                error: error.message
            });
        }
    }

    async getMechanicReviewStats(req, res) {
        try {
            const { mechanicId } = req.params;
            const stats = await this.calculateReviewStats(mechanicId);
            return res.status(200).json(stats);
        } catch (error) {
            console.error("Error in getMechanicReviewStats:", error);
            return res.status(500).json({
                message: 'Error fetching review statistics',
                error: error.message
            });
        }
    }

    // Helper methods
    validateRating(rating) {
        try {
            return rating >= 1 && rating <= 5;
        } catch (error) {
            console.error("Error in validateRating:", error);
            throw error;
        }
    }

    async verifyAppointment(appointmentId, mechanicId, userId) {
        try {
            return await AppointmentModel.findOne({
                _id: appointmentId,
                mechanicId,
                clientId: userId,
                status: AppointmentStatusEnum.COMPLETED
            });
        } catch (error) {
            console.error("Error in verifyAppointment:", error);
            throw error;
        }
    }

    async checkExistingReview(appointmentId, userId) {
        try {
            return await ReviewModel.findOne({
                appointmentId,
                clientId: userId
            });
        } catch (error) {
            console.error("Error in checkExistingReview:", error);
            throw error;
        }
    }

    async createNewReview({ mechanicId, userId, appointmentId, rating, review, appointment }) {
        try {
            return await ReviewModel.create({
                mechanicId,
                clientId: userId,
                appointmentId,
                rating,
                review,
                verified: true,
                serviceReceived: {
                    serviceId: appointment.serviceId,
                    serviceName: appointment.serviceName
                }
            });
        } catch (error) {
            console.error("Error in createNewReview:", error);
            throw error;
        }
    }

    async updateMechanicRating(mechanicId) {
        try {
            const reviews = await ReviewModel.find({ mechanicId });
            const mechanic = await MechanicModel.findById(mechanicId);
            
            if (reviews.length > 0) {
                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                mechanic.averageRating = Number((totalRating / reviews.length).toFixed(1));
            } else {
                mechanic.averageRating = 0;
            }
            
            mechanic.totalReviews = reviews.length;
            await mechanic.save();
        } catch (error) {
            console.error("Error in updateMechanicRating:", error);
            throw error;
        }
    }

    async calculateReviewStats(mechanicId) {
        try {
            const reviews = await ReviewModel.find({ mechanicId });

            const stats = {
                totalReviews: reviews.length,
                averageRating: 0,
                ratingDistribution: {
                    5: 0,
                    4: 0,
                    3: 0,
                    2: 0,
                    1: 0
                }
            };

            if (reviews.length > 0) {
                reviews.forEach(review => {
                    stats.ratingDistribution[review.rating]++;
                });

                stats.averageRating = Number(
                    (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                );
            }

            return stats;
        } catch (error) {
            console.error("Error in calculateReviewStats:", error);
            throw error;
        }
    }
}

export default ReviewController;