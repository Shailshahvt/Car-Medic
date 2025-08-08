/**
 * Authentication Controller
 * Handles user authentication operations such as signup, login, logout, and token management.
 * 
 * Author: Ahmed Aredah
 */

import { UserTypeEnum } from '../enums/userType.enum.js';
import { UserModel } from '../models/users.model.js';
import { checkUserExists } from '../utils/validation.utils.js';
import { sendVerificationEmail } from '../utils/email.utils.js';
import { tokenService } from '../services/token.service.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthController {
    constructor() {
        try {
            this.signup = this.signup.bind(this);
            this.login = this.login.bind(this);
            this.logout = this.logout.bind(this);
            this.logoutAll = this.logoutAll.bind(this);
            this.updateLastLogin = this.updateLastLogin.bind(this);
        } catch (error) {
            console.error("Error in constructor:", error);
            throw error;
        }
    }

    async checkEmail(req, res) {
        try {
            const email = req.params.email;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    valid: false,
                    message: 'Invalid email format'
                });
            }

            const { exists } = await checkUserExists(email);
            
            return res.status(200).json({
                available: !exists,
                message: exists ? 'Email already registered' : 'Email available'
            });

        } catch (error) {
            console.error("Error in checkEmail:", error);
            return res.status(500).json({
                message: 'Error checking email availability',
                error: error.message
            });
        }
    }

    async signup(req, res) {
        try {
            const { firstName, lastName, email, password, type } = req.body;

            // Input validation
            if (!firstName || !lastName || !email || !password || !type) {
                return res.status(400).json({
                    message: 'All fields are required',
                    missingFields: Object.entries({ firstName, lastName, email, password, type })
                        .filter(([_, value]) => !value)
                        .map(([key]) => key)
                });
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: 'Invalid email format',
                    field: 'email'
                });
            }

            // Check if user exists
            const { exists } = await checkUserExists(email);
            if (exists) {
                return res.status(400).json({
                    message: 'Email already registered',
                    field: 'email'
                });
            }

            const user = await this.createUser(req.body);
            const token = await this.generateToken(user);

            // Store token in database
            const deviceInfo = {
                userAgent: req.headers['user-agent'],
                ip: req.ip,
                deviceType: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
                browser: req.headers['user-agent']
            };
            try {
                await tokenService.createToken(user._id, 'auth', deviceInfo);
            } catch (tokenError) {
                console.error('Token creation error:', tokenError);
                return res.status(500).json({ 
                    message: 'Error creating authentication token',
                    error: tokenError.message 
                });
            }

            // console.log("Sending verification email...");
            // await sendVerificationEmail(user.email, user._id);  // TODO: MAKE SURE THIS IS WORKING FINE BEFORE INTEGRATION

            return res.status(201).json({
                message: 'User registered successfully',
                token,
                user: this.sanitizeUser(user)
            });

        } catch (error) {
            console.error("Error in signup:", error);
            return res.status(500).json({
                message: 'Error creating user',
                error: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.validateCredentials(email, password);
            
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = await this.generateToken(user); // Generate the token

            // Store the token
            const deviceInfo = {
                userAgent: req.headers['user-agent'],
                ip: req.ip,
                deviceType: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
                browser: req.headers['user-agent']
            };

            try {
                await tokenService.createToken(user._id, 'auth', deviceInfo);
            } catch (tokenError) {
                console.error('Token creation error:', tokenError);
                return res.status(500).json({ 
                    message: 'Error creating authentication token',
                    error: tokenError.message 
                });
            }

            await this.updateLastLogin(user);  // Uodate the user last login

            return res.status(200).json({
                message: 'Login successful',
                token,
                user: this.sanitizeUser(user)
            });

        } catch (error) {
            console.error("Error in login:", error);
            return res.status(500).json({
                message: 'Error during login',
                error: error.message
            });
        }
    }

    async updateLastLogin(user) {
        try {
            await UserModel.findByIdAndUpdate(
                user._id,
                { $set: { lastLoginAt: new Date() } }
            );
        } catch (error) {
            console.error("Error in updateLastLogin:", error);
            throw error;
        }
    }

    async logout(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            await tokenService.invalidateToken(token);
            return res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error("Error in logout:", error);
            return res.status(500).json({
                message: 'Error during logout',
                error: error.message
            });
        }
    }

    async logoutAll(req, res) {
        try {
            await tokenService.invalidateUserTokens(req.user.userId);
            return res.status(200).json({ message: 'Logged out from all devices' });
        } catch (error) {
            console.error("Error in logoutAll:", error);
            return res.status(500).json({
                message: 'Error during logout',
                error: error.message
            });
        }
    }

    // Helper methods
    async createUser(userData) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const user = new UserModel({
                ...userData,
                password: hashedPassword,
                verified: false,
                emailVerified: false,
                createdAt: new Date(),
                lastLoginAt: new Date()
            });

            const savedUser = await user.save();
            return savedUser;
        } catch (error) {
            console.error("Error in createUser:", error);
            throw error;
        }
    }

    async generateToken(user) {
        try {
            return jwt.sign(
                { userId: user._id, type: user.type, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
        } catch (error) {
            console.error("Error in generateToken:", error);
            throw error;
        }
    }

    async validateCredentials(email, password) {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) return null;

            const validPassword = await bcrypt.compare(password, user.password);
            return validPassword ? user : null;
        } catch (error) {
            console.error("Error in validateCredentials:", error);
            throw error;
        }
    }


    sanitizeUser(user) {
        try {
            return {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                type: user.type,
                verified: user.verified,
                emailVerified: user.emailVerified
            };
        } catch (error) {
            console.error("Error in sanitizeUser:", error);
            throw error;
        }
    }
}

export default AuthController;