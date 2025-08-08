import axios from 'axios';

const backendHost = process.env.REACT_APP_BACKEND_HOST;
const backendPort = process.env.REACT_APP_BACKEND_PORT;
const basePath = `${backendHost}:${backendPort}/api`;

// Add token to requests if available
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    console.log("TOKEN: ", token);
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const usersService = {
    getProfile: async () => {
        try {
            const url = `${basePath}/users/profile`;
            const response = await axios.get(url, {
                headers: getAuthHeaders()
            });
            return response.status === 200
                ? { success: true, data: response.data.user }
                : { success: false, error: "Error fetching profile" };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Error fetching profile"
            };
        }
    },

    updateProfile: async (profileData) => {
        try {
            const url = `${basePath}/users/profile`;
            const response = await axios.put(url, profileData, {
                headers: getAuthHeaders()
            });
            return response.status === 200
                ? { success: true, data: response.data.user }
                : { success: false, error: "Error updating profile" };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Error updating profile"
            };
        }
    },

    addVehicle: async (vehicleData) => {
        try {
            const url = `${basePath}/users/garage/add`;
            const response = await axios.post(url, vehicleData, {
                headers: getAuthHeaders()
            });
            return response.status === 201
                ? { success: true, data: response.data.vehicle }
                : { success: false, error: "Error adding vehicle" };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Error adding vehicle"
            };
        }
    },

    removeVehicle: async (vehicleId) => {
        try {
            const url = `${basePath}/users/garage/${vehicleId}`;
            const response = await axios.delete(url, {
                headers: getAuthHeaders()
            });
            return response.status === 200
                ? { success: true, message: "Vehicle removed successfully" }
                : { success: false, error: "Error removing vehicle" };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Error removing vehicle"
            };
        }
    },

    // Admin methods
    getAllUsers: async (page = 1, limit = 10, search = '') => {
        try {
            const url = `${basePath}/users?page=${page}&limit=${limit}&search=${search}`;
            const response = await axios.get(url, {
                headers: getAuthHeaders()
            });
            return response.status === 200
                ? { success: true, data: response.data }
                : { success: false, error: "Error fetching users" };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Error fetching users"
            };
        }
    },

    updateUserStatus: async (userId, status) => {
        try {
            const url = `${basePath}/users/${userId}/status`;
            const response = await axios.patch(url, { status }, {
                headers: getAuthHeaders()
            });
            return response.status === 200
                ? { success: true, data: response.data.user }
                : { success: false, error: "Error updating user status" };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Error updating user status"
            };
        }
    },
    cancelAppointment: async (appointmentId) => {
        try {
            const url = `${basePath}/users/appointments/${appointmentId}/cancel`;
          const response = await axios.patch(url, {}, {
            headers: getAuthHeaders()
          });
          return response.status === 200
            ? { success: true }
            : { success: false, error: "Error cancelling appointment" };
        } catch (error) {
          return {
            success: false,
            error: error.response?.data?.message || "Error cancelling appointment"
          };
        }
      },
      

    getUserAppointments: async (status = '', page = 1, limit = 10) => {
        try {
            const url = `${basePath}/users/appointments?status=${status}&page=${page}&limit=${limit}`;
            const response = await axios.get(url, {
                headers: getAuthHeaders()
            });
            return response.status === 200
                ? { success: true, data: response.data }
                : { success: false, error: "Error fetching appointments" };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Error fetching appointments"
            };
        }
    }
};

export default usersService;