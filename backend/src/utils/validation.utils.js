/**
 * This file provides utility functions for validation, 
 * including checking if a user with a specific email exists in the database.
 * 
 * Author: Ahmed Aredah
 */

import { UserModel } from '../models/users.model.js';

/**
 * Check if email already exists in database
 * @param {string} email - Email to check
 * @returns {Promise<{exists: boolean, user: Object|null}>}
 */
export const checkUserExists = async (email) => {
    try {
        const user = await UserModel.findOne({ email });
        return {
            exists: !!user,
            user: user
        };
    } catch (error) {
        throw new Error(`Error checking user existence: ${error.message}`);
    }
};