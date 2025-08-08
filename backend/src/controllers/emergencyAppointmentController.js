/**
 * Emergency Appointment Controller
 * Extends the AppointmentController to handle emergency-specific appointment operations.
 * 
 * Author: Ahmed Aredah
 */

import AppointmentController from './appointmentController.js';
import { AppointmentModel } from '../models/appointments.model.js';
import { MechanicModel } from '../models/mechanics.model.js';
import { AppointmentStatusEnum } from '../enums/appointmentStatus.enum.js';

class EmergencyAppointmentController extends AppointmentController {
    constructor() {
        super();
        try {
            this.createEmergencyAppointment = this.createEmergencyAppointment.bind(this);
            this.getUserEmergencyAppointments = this.getUserEmergencyAppointments.bind(this);
            this.getMechanicEmergencyAppointments = this.getMechanicEmergencyAppointments.bind(this);
        } catch (error) {
            console.error("Error in EmergencyAppointmentController constructor:", error);
            throw error;
        }
    }

    async createEmergencyAppointment(req, res) {
        try {
            // Set type to emergency
            req.body.type = 'emergency';
            
            // Use the parent class method for creating appointments
            return await this.createAppointment(req, res);
        } catch (error) {
            console.error("Error in createEmergencyAppointment:", error);
            return res.status(500).json({
                message: 'Error creating emergency appointment',
                error: error.message
            });
        }
    }

    async getUserEmergencyAppointments(req, res) {
        try {
            // Set type filter to emergency
            req.query.type = 'emergency';
            
            // Use the parent class method
            return await this.getUserAppointments(req, res);
        } catch (error) {
            console.error("Error in getUserEmergencyAppointments:", error);
            return res.status(500).json({
                message: 'Error fetching emergency appointments',
                error: error.message
            });
        }
    }

    async getMechanicEmergencyAppointments(req, res) {
        try {
            // Set type filter to emergency
            req.query.type = 'emergency';
            
            // Use the parent class method
            return await this.getMechanicAppointments(req, res);
        } catch (error) {
            console.error("Error in getMechanicEmergencyAppointments:", error);
            return res.status(500).json({
                message: 'Error fetching mechanic emergency appointments',
                error: error.message
            });
        }
    }

    // You can add emergency-specific methods here
    async findNearbyMechanicsForEmergency(req, res) {
        try {
            const { latitude, longitude, radius = 10 } = req.body; // radius in km
            
            // Find mechanics with emergency service capability 
            // and within the specified radius
            const nearbyMechanics = await MechanicModel.find({
                'services.name': { $regex: /emergency/i },
                'location.coordinates': {
                    $nearSphere: {
                        $geometry: {
                            type: "Point",
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: radius * 1000 // convert to meters
                    }
                }
            }).select('businessName location hourlyRate averageRating totalReviews');

            return res.status(200).json({
                mechanics: nearbyMechanics
            });
        } catch (error) {
            console.error("Error in findNearbyMechanicsForEmergency:", error);
            return res.status(500).json({
                message: 'Error finding nearby mechanics',
                error: error.message
            });
        }
    }
}

export default EmergencyAppointmentController;