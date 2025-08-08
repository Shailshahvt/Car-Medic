import axios from "axios";
import LocalStorage from "../utils/LocalStorage.js";

const backendHost = process.env.REACT_APP_BACKEND_HOST;
const backendPort = process.env.REACT_APP_BACKEND_PORT;
const basePath = `${backendHost}:${backendPort}/api`;

// Add token to requests if available
const getAuthHeaders = () => {
    const token = LocalStorage.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const authService = {
    login: async (email, password) => {
        try {
            const url = `${basePath}/auth/login`;
            const params = {
                email,
                password,
            };
    
            const response = await axios.post(url, params);
            
            if (response.status === 200) {
                // Store auth data
                if (response.data.token) {
                    LocalStorage.setToken(response.data.token);
                }
                
                if (response.data.user) {
                    LocalStorage.setUser(response.data.user);
                }                
                
                return { 
                    success: true, 
                    data: response.data 
                };
            } else {
                return { success: false, error: "Login failed" };
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Invalid credentials"
            };
        }
    },

    signup: async (userData) => {
        try {
            const url = `${basePath}/auth/signup`;
            const params = {
                ...userData,
                type: userData.type.toLowerCase()
            };
            const response = await axios.post(url, params);
            
            if (response.status === 201) {
                return { 
                    success: true, 
                    data: response.data,
                    message: "Registration successful" 
                };
            }
            return { success: false, error: "Registration failed" };
        } catch (error) {
            if (error.response?.status === 400) {
                return { 
                    success: false, 
                    error: error.response.data.message || "Invalid registration details" 
                };
            }
            return { 
                success: false, 
                error: error.response?.data?.message || "Error during registration" 
            };
        }
    },

    logout: async () => {
        try {
            const url = `${basePath}/auth/logout`;
            await axios.post(url, {}, {
                headers: getAuthHeaders()
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Always clear local storage even if the API call fails
            LocalStorage.clearAuth();
        }
    },

    logoutAll: async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const url = `${basePath}/auth/logout-all`;
                await axios.post(url, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            LocalStorage.clearAuth();
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || "Error during logout" 
            };
        }
    },

    forgotPassword: async (email) => {
        try {
            const url = `${basePath}/auth/forgot-password`;
            const response = await axios.post(url, { email });
            
            if (response.status === 200) {
                return { 
                    success: true, 
                    message: "Password reset instructions have been sent to your email" 
                };
            }
            return { success: false, error: "Failed to process request" };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || "Error processing password reset request" 
            };
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const url = `${basePath}/auth/reset-password`;
            const response = await axios.post(url, { token, newPassword });
            
            if (response.status === 200) {
                return { success: true, message: "Password has been reset successfully" };
            }
            return { success: false, error: "Failed to reset password" };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || "Error resetting password" 
            };
        }
    },

    checkEmail: async (email) => {
        try {
            const url = `${basePath}/auth/check-email/${encodeURIComponent(email)}`;
            const response = await axios.get(url);
            return {
                success: true,
                available: response.data.available,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Error checking email availability"
            };
        }
    }
};

export default authService;