/**
 * Appointment Controller
 * Handles appointment-related operations such as creation, retrieval, and status updates.
 * 
 * Author: Ahmed Aredah
 */

import { AppointmentModel } from '../models/appointments.model.js';
import { MechanicModel } from '../models/mechanics.model.js';
import { AppointmentStatusEnum } from '../enums/appointmentStatus.enum.js';

class AppointmentController {
    constructor() {
        try {
            this.createAppointment = this.createAppointment.bind(this);
            this.getUserAppointments = this.getUserAppointments.bind(this);
            this.getMechanicAppointments = this.getMechanicAppointments.bind(this);
            this.updateAppointmentStatus = this.updateAppointmentStatus.bind(this);
            this.checkSlotAvailability = this.checkSlotAvailability.bind(this);
            this.updateMechanicSchedule = this.updateMechanicSchedule.bind(this);
            this.bookAppointment = this.createAppointment;
        } catch (error) {
            console.error("Error in constructor:", error);
            throw error;
        }
    }

    async createAppointment(req, res) {
        try {
            const {
                mechanicId,
                serviceId,
                serviceName,
                startTime,
                vehicleId,
                type = 'walk‑in'
            } = req.body;
            const clientId = req.user.userId;

            if (!mechanicId || (!serviceId && (!serviceName || serviceName.trim() === ''))) {
                return res.status(400).json({
                    message: 'Missing required fields',
                    required: ['mechanicId', 'serviceId OR serviceName']
                });
            }

            const mechanic = await MechanicModel.findById(mechanicId);
            if (!mechanic) return res.status(404).json({ message: 'Mechanic not found' });

            const normalizedServiceName = serviceName && typeof serviceName === 'string' ? serviceName.toLowerCase() : null;

            console.log("Booking payload:", {
                mechanicId,
                serviceName,
                normalizedServiceName,
                startTime: startTime || new Date().toISOString()
            });

            if (!mechanic.services || !Array.isArray(mechanic.services)) {
                return res.status(404).json({ message: 'Mechanic has no services' });
            }

            const mechanicService = mechanic.services.find(s => {
                return serviceId && s.serviceId?.toString() === serviceId;
            });

            if (!mechanicService)
                return res.status(404).json({ message: 'Service not offered by this mechanic' });

            const resolvedServiceId = serviceId || mechanicService.serviceId.toString();

            const begin = startTime ? new Date(startTime) : new Date();
            const durationH = mechanicService.estimatedDuration || 1;
            const end = new Date(begin.getTime() + durationH * 60 * 60 * 1000);

            const appointment = new AppointmentModel({
                mechanicId,
                clientId,
                serviceId: resolvedServiceId,
                startTime: begin,
                endTime: end,
                type,
                status: AppointmentStatusEnum.PENDING,
                ...(vehicleId && {
                    vehicle: { carModelId: vehicleId, clientGarageId: vehicleId }
                }),
                totalCost: mechanicService.price
            });

            await appointment.save();

            return res.status(201).json({
                message: 'Appointment created successfully',
                appointment
            });
        } catch (error) {
            console.error("Error in createAppointment:", error);
            return res.status(500).json({
                message: 'Error creating appointment',
                error: error.message
            });
        }
    }

    async getUserAppointments(req, res) {
        try {
            const { status, type, page = 1, limit = 10 } = req.query;
            const userId = req.user.userId;

            const query = { clientId: userId };
            if (status) query.status = status;
            if (type) query.type = type;

            const appointments = await AppointmentModel.find(query)
                .sort({ startTime: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('mechanicId', 'businessName location')
                .populate('serviceId', 'name');

            const total = await AppointmentModel.countDocuments(query);

            return res.status(200).json({
                appointments,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page)
            });
        } catch (error) {
            console.error("Error in getUserAppointments:", error);
            return res.status(500).json({
                message: 'Error fetching appointments',
                error: error.message
            });
        }
    }

    async getMechanicAppointments(req, res) {
        try {
            const { mechanicId } = req.params;
            const { status, type, date, page = 1, limit = 10 } = req.query;

            const query = { mechanicId };
            if (status) query.status = status;
            if (type) query.type = type;
            if (date) {
                const startOfDay = new Date(date);
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59);
                query.startTime = { $gte: startOfDay, $lte: endOfDay };
            }

            const appointments = await AppointmentModel.find(query)
                .sort({ startTime: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('clientId', 'firstName lastName email')
                .populate('serviceId', 'name');

            const total = await AppointmentModel.countDocuments(query);

            return res.status(200).json({
                appointments,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page)
            });
        } catch (error) {
            console.error("Error in getMechanicAppointments:", error);
            return res.status(500).json({
                message: 'Error fetching mechanic appointments',
                error: error.message
            });
        }
    }

    async updateAppointmentStatus(req, res) {
        try {
            const { appointmentId } = req.params;
            const { status, message } = req.body;

            if (!Object.values(AppointmentStatusEnum).includes(status)) {
                return res.status(400).json({
                    message: 'Invalid status',
                    allowedStatuses: Object.values(AppointmentStatusEnum)
                });
            }

            const appointment = await AppointmentModel.findById(appointmentId);
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            appointment.status = status;
            appointment.mechanicResponse = {
                message,
                responseDate: new Date()
            };

            await appointment.save();

            if (status === AppointmentStatusEnum.ACCEPTED) {
                await this.updateMechanicSchedule(
                    appointment.mechanicId,
                    appointment.startTime,
                    appointment.endTime,
                    appointmentId
                );
            }

            return res.status(200).json({
                message: 'Appointment status updated successfully',
                appointment
            });
        } catch (error) {
            console.error("Error in updateAppointmentStatus:", error);
            return res.status(500).json({
                message: 'Error updating appointment status',
                error: error.message
            });
        }
    }

    async checkSlotAvailability(mechanic, startTime, endTime) {
        try {
            const scheduleDate = new Date(startTime).toDateString();
            const schedule = mechanic.schedule.find(s =>
                s.date.toDateString() === scheduleDate
            );

            if (!schedule) return false;

            return schedule.slots.some(slot => {
                const slotStart = new Date(slot.startTime);
                const slotEnd = new Date(slot.endTime);
                return (
                    slot.isAvailable &&
                    slotStart <= new Date(startTime) &&
                    slotEnd >= new Date(endTime)
                );
            });
        } catch (error) {
            console.error("Error in checkSlotAvailability:", error);
            throw error;
        }
    }

    async updateMechanicSchedule(mechanicId, startTime, endTime, appointmentId) {
        try {
            const mechanic = await MechanicModel.findById(mechanicId);
            const scheduleDate = new Date(startTime).toDateString();
            const scheduleIndex = mechanic.schedule.findIndex(s =>
                s.date.toDateString() === scheduleDate
            );

            if (scheduleIndex >= 0) {
                mechanic.schedule[scheduleIndex].slots = mechanic.schedule[scheduleIndex].slots.map(slot => {
                    if (
                        new Date(slot.startTime) <= new Date(startTime) &&
                        new Date(slot.endTime) >= new Date(endTime)
                    ) {
                        slot.isAvailable = false;
                        slot.appointmentId = appointmentId;
                    }
                    return slot;
                });
                await mechanic.save();
            }
        } catch (error) {
            console.error("Error in updateMechanicSchedule:", error);
            throw error;
        }
    }
}

export default AppointmentController;
