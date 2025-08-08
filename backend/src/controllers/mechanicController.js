/**
 * MechanicController handles all operations related to mechanics, 
 * including creating mechanics, managing services, schedules, and ownership.
 * 
 * Author: Ahmed Aredah
 */

import { MechanicModel } from '../models/mechanics.model.js';
import { UserModel } from '../models/users.model.js';
import { RoleEnum } from '../enums/permissions.enum.js';
import { UserTypeEnum } from '../enums/userType.enum.js';
import { ServiceModel } from '../models/services.model.js';
import mongoose from 'mongoose'; 


class MechanicController {
    constructor() {
        try {
            this.createMechanic = this.createMechanic.bind(this);
            this.transferOwnership = this.transferOwnership.bind(this);
            this.createSlots = this.createSlots.bind(this);
            this.getAvailableSlots = this.getAvailableSlots.bind(this);
            this.addService = this.addService.bind(this);
            this.verifyOwnership = this.verifyOwnership.bind(this);
            this.validateSlots = this.validateSlots.bind(this);
            this.updateMechanicSchedule = this.updateMechanicSchedule.bind(this);
            this.findAvailableSlots = this.findAvailableSlots.bind(this);
        } catch (error) {
            console.error("Error in constructor:", error);
            throw error;
        }
    }

    async getMechanicsByDistance(req, res) {
        try {
            const { 
                latitude, 
                longitude, 
                radius = 10, 
                serviceId, 
                serviceIds,  // multiple services
                limit = 10 
            } = req.query;
            
            // Validate coordinates
            if (!latitude || !longitude) {
                return res.status(400).json({
                message: 'Missing coordinates',
                required: ['latitude', 'longitude']
                });
            }
          
            // Build the base query with location
            const query = {
                'location.coordinates': {
                $nearSphere: {
                    $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
                }
                }
            };
          
            // Handle service filtering
            if (serviceIds) {
                // Parse array of service IDs
                const parsedServiceIds = Array.isArray(serviceIds) 
                ? serviceIds 
                : JSON.parse(serviceIds);
                
                if (parsedServiceIds.length > 0) {
                // Find mechanics that offer all of the selected services
                query['services.serviceId'] = { 
                    $all: parsedServiceIds.map(id => mongoose.Types.ObjectId(id)) 
                };
                }
            } 
            // Backward compatibility for single service
            else if (serviceId) {
                query['services.serviceId'] = mongoose.Types.ObjectId(serviceId);
            }
            
            // Execute the query
            const mechanics = await MechanicModel.find(query)
                .limit(parseInt(limit))
                .select('businessName location hourlyRate averageRating totalReviews services')
                .populate('services.serviceId', 'name category description')
                .lean();
            
            // Calculate additional details for each mechanic
            const mechanicsWithDetails = mechanics.map(mechanic => {
                // Filter services to only show requested ones if serviceIds were provided
                if (serviceIds) {
                const parsedServiceIds = Array.isArray(serviceIds) ? serviceIds : JSON.parse(serviceIds);
                
                // Include only the services that were requested
                const filteredServices = mechanic.services.filter(service => 
                    parsedServiceIds.includes(service.serviceId._id.toString())
                );
                
                return {
                    ...mechanic,
                    relevantServices: filteredServices
                };
                }
                
                return mechanic;
            });
            
            return res.status(200).json({
                mechanics: mechanicsWithDetails,
                count: mechanicsWithDetails.length
            });
        } catch (error) {
            console.error("Error in getMechanicsByDistance:", error);
            return res.status(500).json({
                message: 'Error finding mechanics by distance',
                error: error.message
            });
        }
    }
    
    async createMechanic(req, res) {
        try {
            const { businessName, hourlyRate, location } = req.body;
            const userId = req.user.userId;

            // Verify user exists
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Create mechanic shop
            const mechanic = new MechanicModel({
                businessName,
                hourlyRate,
                location,
                admins: [{
                    userId: userId,
                    role: RoleEnum.OWNER,
                    addedAt: new Date(),
                    addedBy: userId
                }]
            });

            await mechanic.save();

            // Update user type to mechanic if they're a customer
            if (user.type === UserTypeEnum.CUSTOMER) {
                user.type = UserTypeEnum.MECHANIC;
                await user.save();
            }

            return res.status(201).json({
                message: 'Mechanic shop created successfully',
                mechanic
            });
        } catch (error) {
            console.error("Error in createMechanic:", error);
            return res.status(500).json({
                message: 'Error creating mechanic shop',
                error: error.message
            });
        }
    }

    async transferOwnership(req, res) {
        try {
            const { mechanicId } = req.params;
            const { newOwnerId } = req.body;
            const currentUserId = req.user.userId;

            const mechanic = await this.verifyOwnership(mechanicId, currentUserId);
            if (!mechanic) {
                return res.status(403).json({ message: 'Only owner can transfer ownership' });
            }

            const newOwner = await UserModel.findById(newOwnerId);
            if (!newOwner) {
                return res.status(404).json({ message: 'New owner not found' });
            }

            // Update roles
            mechanic.admins = mechanic.admins.map(admin => {
                if (admin.userId.toString() === currentUserId) {
                    admin.role = RoleEnum.MANAGER;
                }
                if (admin.userId.toString() === newOwnerId) {
                    admin.role = RoleEnum.OWNER;
                }
                return admin;
            });

            await mechanic.save();

            return res.status(200).json({
                message: 'Ownership transferred successfully',
                mechanic
            });
        } catch (error) {
            console.error("Error in transferOwnership:", error);
            return res.status(500).json({
                message: 'Error transferring ownership',
                error: error.message
            });
        }
    }

    async createSlots(req, res) {
        try {
            const { mechanicId } = req.params;
            const { date, slots } = req.body;

            if (!this.validateSlots(slots)) {
                return res.status(400).json({ message: 'Invalid slots format' });
            }

            const mechanic = await MechanicModel.findById(mechanicId);
            if (!mechanic) {
                return res.status(404).json({ message: 'Mechanic shop not found' });
            }

            const updatedSchedule = await this.updateMechanicSchedule(mechanic, date, slots);

            return res.status(200).json({
                message: 'Slots created successfully',
                schedule: updatedSchedule
            });
        } catch (error) {
            console.error("Error in createSlots:", error);
            return res.status(500).json({
                message: 'Error creating slots',
                error: error.message
            });
        }
    }

    async getAvailableSlots(req, res) {
        try {
            const { mechanicId } = req.params;
            const { date } = req.query;

            const mechanic = await MechanicModel.findById(mechanicId);
            if (!mechanic) {
                return res.status(404).json({ message: 'Mechanic shop not found' });
            }

            const availableSlots = await this.findAvailableSlots(mechanic, date);

            return res.status(200).json({ availableSlots });
        } catch (error) {
            console.error("Error in getAvailableSlots:", error);
            return res.status(500).json({
                message: 'Error fetching slots',
                error: error.message
            });
        }
    }


    async addService(req, res) {
        try {
            const { mechanicId } = req.params;
            const { serviceId, price, estimatedDuration, isEmergency, vehicleTypes, additionalInfo } = req.body;
        
            // Validate input
            if (!serviceId || !price || !estimatedDuration) {
                return res.status(400).json({
                    message: 'Missing required fields',
                    required: {
                        serviceId: 'Service ID is required',
                        price: 'Service price is required',
                        estimatedDuration: 'Estimated duration in hours is required'
                    }
                });
            }
        
            // Validate numeric fields
            if (estimatedDuration <= 0 || price <= 0) {
                return res.status(400).json({
                    message: 'Invalid values',
                    errors: {
                        ...(estimatedDuration <= 0 && { estimatedDuration: 'Duration must be greater than 0' }),
                        ...(price <= 0 && { price: 'Price must be greater than 0' })
                    }
                });
            }
        
            // Check if mechanic exists
            const mechanic = await MechanicModel.findById(mechanicId);
            if (!mechanic) {
                return res.status(404).json({
                    message: 'Mechanic shop not found'
                });
            }
        
            // Check if service exists
            const service = await ServiceModel.findById(serviceId);
            if (!service) {
                return res.status(404).json({
                    message: 'Service not found'
                });
            }
        
            // Check if mechanic already offers this service
            const serviceExists = mechanic.services.some(
                s => s.serviceId.toString() === serviceId
            );
        
            if (serviceExists) {
                return res.status(400).json({
                    message: 'Mechanic already offers this service'
                });
            }
        
            // Add service to mechanic
            mechanic.services.push({
                serviceId,
                price,
                estimatedDuration,
                isEmergency: isEmergency || false,
                vehicleTypes: vehicleTypes || ['sedan', 'SUV', 'truck', 'hatchback', 'van', 'coupe'],
                additionalInfo
            });
        
            await mechanic.save();
        
            // Increment service popularity
            await ServiceModel.findByIdAndUpdate(
                serviceId, 
                { $inc: { popularity: 1 } }
            );
        
            return res.status(201).json({
                message: 'Service added successfully',
                service: {
                    ...mechanic.services[mechanic.services.length - 1].toObject(),
                    name: service.name,
                    category: service.category,
                    description: service.description
                }
            });
        } catch (error) {
            console.error("Error in addService:", error);
            return res.status(500).json({
                message: 'Error adding service',
                error: error.message
            });
        }
    }

    // Helper methods
    async verifyOwnership(mechanicId, userId) {
        try {
            const mechanic = await MechanicModel.findOne({
                _id: mechanicId,
                'admins.userId': userId,
                'admins.role': RoleEnum.OWNER
            });
            return mechanic;
        } catch (error) {
            console.error("Error in verifyOwnership:", error);
            throw error;
        }
    }

    validateSlots(slots) {
        try {
            if (!Array.isArray(slots) || !slots.length) return false;
            
            return slots.every(slot => 
                slot.startTime && 
                slot.endTime && 
                new Date(slot.startTime) < new Date(slot.endTime)
            );
        } catch (error) {
            console.error("Error in validateSlots:", error);
            throw error;
        }
    }

    async updateMechanicSchedule(mechanic, date, newSlots) {
        try {
            const scheduleIndex = mechanic.schedule.findIndex(
                s => s.date.toDateString() === new Date(date).toDateString()
            );

            if (scheduleIndex >= 0) {
                mechanic.schedule[scheduleIndex].slots = newSlots;
            } else {
                mechanic.schedule.push({ date, slots: newSlots });
            }

            await mechanic.save();
            return mechanic.schedule;
        } catch (error) {
            console.error("Error in updateMechanicSchedule:", error);
            throw error;
        }
    }

    async findAvailableSlots(mechanic, date) {
        try {
            const schedule = mechanic.schedule.find(
                s => s.date.toDateString() === new Date(date).toDateString()
            );

            return schedule?.slots.filter(slot => slot.isAvailable) || [];
        } catch (error) {
            console.error("Error in findAvailableSlots:", error);
            throw error;
        }
    }

    async getMechanicsByServiceName(req, res) {
        try {
            const { name } = req.query;
            if (!name) {
                return res.status(400).json({ message: 'Service name is required' });
            }
    
            // Get service ID(s) matching the name
            const service = await ServiceModel.findOne({ name });
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }
    
            const mechanics = await MechanicModel.find({
                'services.serviceId': new mongoose.Types.ObjectId(service._id)
            })
            .select('businessName location hourlyRate averageRating services')
            .lean();
    
            return res.status(200).json({ mechanics });
        } catch (error) {
            console.error("Error in getMechanicsByServiceName:", error);
            return res.status(500).json({
                message: 'Error fetching mechanics by service name',
                error: error.message
            });
        }
    }
}

export default MechanicController;