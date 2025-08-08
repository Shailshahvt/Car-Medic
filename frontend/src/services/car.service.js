import axios from 'axios';

const backendHost = process.env.REACT_APP_BACKEND_HOST;
const backendPort = process.env.REACT_APP_BACKEND_PORT;
const basePath = `${backendHost}:${backendPort}/api`;

// Add token to requests if available
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const carService = {
    getCarMakes: async () => {
        try {
            const url = `${basePath}/cars/makes`;
            const response = await axios.get(url, {
                headers: getAuthHeaders()
            });
            return response.status === 200
                ? response.data
                : [];
        } catch (error) {
            console.error("Error fetching car makes:", error);
            return [];
        }
    },

    getModelsByMake: async (makeId) => {
        try {
            const url = `${basePath}/cars/models?makeId=${makeId}`;
            const response = await axios.get(url, {
                headers: getAuthHeaders()
            });
            return response.status === 200
                ? response.data
                : [];
        } catch (error) {
            console.error("Error fetching car models:", error);
            return [];
        }
    }
};

export default carService;