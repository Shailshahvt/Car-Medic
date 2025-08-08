/**
 * This file provides utility functions for email operations, 
 * including sending verification emails and verifying email tokens.
 * 
 * Author: Ahmed Aredah
 */

import nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';
import jwt from 'jsonwebtoken';
import { TokenModel } from '../models/tokens.model.js';

// Load environment variables
const {
    NODEMAILER_TOKEN,
    VERIFICATION_EMAIL_SENDER_ADDRESS,
    VERIFICATION_EMAIL_SENDER_NAME,
    MAILTRAP_TEST_INBOX_ID,
    FRONTEND_URL,
    JWT_SECRET
} = process.env;

// Create transporter using MailtrapTransport
const transport = nodemailer.createTransport(
    MailtrapTransport({
        token: NODEMAILER_TOKEN, 
        testInboxId: MAILTRAP_TEST_INBOX_ID,
    })
);

/**
 * Generate verification token and send email
 * @param {string} email - User's email
 * @param {string} userId - User's ID
 */
export const sendVerificationEmail = async (email, userId) => {
    try {
        // Generate verification token
        const verificationToken = jwt.sign(
            { userId, email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Save verification token
        const tokenDoc = new TokenModel({
            userId,
            token: verificationToken,
            type: 'emailVerification',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            isValid: true
        });

        await tokenDoc.save();

        // Create verification URL
        const verificationUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;

        // Email template
        const mailOptions = {
            from: {
                address: VERIFICATION_EMAIL_SENDER_ADDRESS,
                name: VERIFICATION_EMAIL_SENDER_NAME
            },
            to: email,
            subject: 'Verify Your Email Address',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Verify Your Email Address</h2>
                    <p>Thank you for signing up! Please click the button below to verify your email address:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" 
                           style="background-color: #4CAF50; color: white; padding: 14px 20px; 
                                  text-decoration: none; border-radius: 4px; display: inline-block;">
                            Verify Email
                        </a>
                    </div>
                    <p>Or copy and paste this link in your browser:</p>
                    <p>${verificationUrl}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                </div>
            `,
            category: "Integration Test",
            sandbox: true
        };

        // Send email
        await transport.sendMail(mailOptions);

        return { success: true };

    } catch (error) {
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};

// Email verification endpoint handler
export const verifyEmail = async (token) => {
    try {
        // Find token in database
        const tokenDoc = await TokenModel.findOne({
            token,
            type: 'emailVerification',
            isValid: true,
            expiresAt: { $gt: new Date() }
        });

        if (!tokenDoc) {
            throw new Error('Invalid or expired verification token');
        }

        // Verify JWT
        const decoded = jwt.verify(token, JWT_SECRET);

        // Update user's email verification status
        await UserModel.findByIdAndUpdate(decoded.userId, {
            emailVerified: true
        });

        // Invalidate token
        tokenDoc.isValid = false;
        await tokenDoc.save();

        return { success: true };

    } catch (error) {
        throw new Error(`Error verifying email: ${error.message}`);
    }
};
