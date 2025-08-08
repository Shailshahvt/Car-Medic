/**
 * UserController handles all operations related to users, 
 * including profile management, vehicle management, user status updates, 
 * and appointment-related actions.
 * 
 * Author: Ahmed Aredah
 */

import { UserModel } from '../models/users.model.js';
import { TokenModel } from '../models/tokens.model.js';
import { AppointmentModel } from '../models/appointments.model.js'; 
import bcrypt from 'bcrypt';

class UserController {
    constructor() {
        try {
            this.getProfile = this.getProfile.bind(this);
            this.updateProfile = this.updateProfile.bind(this);
            this.addVehicle = this.addVehicle.bind(this);
            this.removeVehicle = this.removeVehicle.bind(this);
            this.getAllUsers = this.getAllUsers.bind(this);
            this.updateUserStatus = this.updateUserStatus.bind(this);
            this.validateVehicleData = this.validateVehicleData.bind(this);
        } catch (error) {
            console.error("Error in constructor:", error);
            throw error;
        }
    }

   

    async getProfile(req, res) {
        try {
            const userId = req.user.userId;
    
            const user = await UserModel.findById(userId).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // ✅ Fetch appointments too
            const appointments = await AppointmentModel.find({ clientId: userId })
                .sort({ startTime: -1 })
                .populate('mechanicId', 'businessName')
                .populate('serviceId', 'name');
    
            return res.status(200).json({ 
                user: {
                    ...user.toObject(),
                    appointmentHistory: appointments  // attach appointments here
                }
            });
    
        } catch (error) {
            console.error("Error in getProfile:", error);
            return res.status(500).json({
                message: 'Error fetching user profile',
                error: error.message
            });
        }
    }
    

    async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const { firstName, lastName, phone, password } = req.body;

            const updateFields = {};
            if (firstName) updateFields.firstName = firstName;
            if (lastName) updateFields.lastName = lastName;
            if (phone) updateFields.phone = phone;

            // If password is being updated, hash it
            if (password) {
                const salt = await bcrypt.genSalt(10);
                updateFields.password = await bcrypt.hash(password, salt);
            }

            const user = await UserModel.findByIdAndUpdate(
                userId,
                { $set: updateFields },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({
                message: 'Profile updated successfully',
                user
            });

        } catch (error) {
            console.error("Error in updateProfile:", error);
            return res.status(500).json({
                message: 'Error updating profile',
                error: error.message
            });
        }
    }

    async addVehicle(req, res) {
        try {
            const userId = req.user.userId;
            const vehicleData = req.body;

            if (!this.validateVehicleData(vehicleData)) {
                return res.status(400).json({
                    message: 'Invalid vehicle data',
                    required: ['carModelId', 'licensePlate', 'year']
                });
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const licensePlateExists = user.garage.some(
                vehicle => vehicle.licensePlate === vehicleData.licensePlate
            );

            if (licensePlateExists) {
                return res.status(400).json({
                    message: 'Vehicle with this license plate already exists'
                });
            }

            user.garage.push({
                ...vehicleData,
                maintenanceHistory: []
            });

            await user.save();

            return res.status(201).json({
                message: 'Vehicle added successfully',
                vehicle: user.garage[user.garage.length - 1]
            });

        } catch (error) {
            console.error("Error in addVehicle:", error);
            return res.status(500).json({
                message: 'Error adding vehicle',
                error: error.message
            });
        }
    }

    async removeVehicle(req, res) {
        try {
            const userId = req.user.userId;
            const { vehicleId } = req.params;

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const vehicleIndex = user.garage.findIndex(
                vehicle => vehicle._id.toString() === vehicleId
            );

            if (vehicleIndex === -1) {
                return res.status(404).json({ message: 'Vehicle not found' });
            }

            user.garage.splice(vehicleIndex, 1);
            await user.save();

            return res.status(200).json({
                message: 'Vehicle removed successfully'
            });

        } catch (error) {
            console.error("Error in removeVehicle:", error);
            return res.status(500).json({
                message: 'Error removing vehicle',
                error: error.message
            });
        }
    }

    // Admin methods
    async getAllUsers(req, res) {
        try {
            const { page = 1, limit = 10, search } = req.query;

            const query = {};
            if (search) {
                query.$or = [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            const users = await UserModel.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            const total = await UserModel.countDocuments(query);

            return res.status(200).json({
                users,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                total
            });

        } catch (error) {
            console.error("Error in getAllUsers:", error);
            return res.status(500).json({
                message: 'Error fetching users',
                error: error.message
            });
        }
    }
    
    async cancelAppointment(req, res) {
        try {
          const { appointmentId } = req.params;
          const userId = req.user.userId;
      
          const appointment = await AppointmentModel.findOne({ _id: appointmentId, clientId: userId });
      
          if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
          }
      
          if (appointment.status === 'completed' || appointment.status === 'cancelled') {
            return res.status(400).json({ message: "Cannot cancel completed or already cancelled appointment" });
          }
      
          appointment.status = 'cancelled';
          await appointment.save();
      
          return res.status(200).json({ message: "Appointment cancelled successfully" });
        } catch (error) {
          console.error("Error in cancelAppointment:", error);
          return res.status(500).json({
            message: "Error cancelling appointment",
            error: error.message
          });
        }
      }
      

    async updateUserStatus(req, res) {
        try {
            const { userId } = req.params;
            const { status } = req.body;

            if (!['active', 'suspended', 'deleted'].includes(status)) {
                return res.status(400).json({
                    message: 'Invalid status',
                    allowedStatuses: ['active', 'suspended', 'deleted']
                });
            }

            const user = await UserModel.findByIdAndUpdate(
                userId,
                { $set: { status } },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (status !== 'active') {
                await TokenModel.updateMany(
                    { userId },
                    { $set: { isValid: false } }
                );
            }

            return res.status(200).json({
                message: 'User status updated successfully',
                user
            });

        } catch (error) {
            console.error("Error in updateUserStatus:", error);
            return res.status(500).json({
                message: 'Error updating user status',
                error: error.message
            });
        }
    }

    validateVehicleData(vehicleData) {
        try {
            const requiredFields = ['carModelId', 'licensePlate', 'year'];
            return requiredFields.every(field => vehicleData[field]);
        } catch (error) {
            console.error("Error in validateVehicleData:", error);
            throw error;
        }
    }
}

export default UserController;