/**
 * This file serves as the central export for all routers, 
 * including authentication, user, mechanic, appointment, 
 * emergency appointment, service, and review routers.
 * 
 * Author: Ahmed Aredah
 */

import AuthRouter from './authRouter.js';
import UserRouter from './userRouter.js';
import MechanicRouter from './mechanicRouter.js';
import AppointmentRouter from './appointmentRouter.js';
import EmergencyAppointmentRouter from './emergencyAppointmentRouter.js';
import ServiceRouter from './serviceRouter.js';
import ReviewRouter from './reviewRouter.js';

export {
    AuthRouter,
    UserRouter,
    MechanicRouter,
    AppointmentRouter,
    EmergencyAppointmentRouter,
    ServiceRouter,
    ReviewRouter
};