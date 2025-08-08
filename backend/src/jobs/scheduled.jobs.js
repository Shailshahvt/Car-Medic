/**
 * This file defines scheduled jobs using cron, 
 * such as periodic token cleanup tasks.
 * 
 * Author: Ahmed Aredah
 */

import cron from 'node-cron';
import { tokenService } from '../services/token.service.js';

// Run cleanup every hour
export const initScheduledJobs = () => {
cron.schedule('0 * * * *', async () => {
    try {
    await tokenService.cleanup();
    console.log('Token cleanup completed successfully');
    } catch (error) {
    console.error('Token cleanup failed:', error);
    }
});
};