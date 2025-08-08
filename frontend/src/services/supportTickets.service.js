import axios from 'axios';

const backendHost = process.env.REACT_APP_BACKEND_HOST;
const backendPort = process.env.REACT_APP_BACKEND_PORT;
const basePath = `${backendHost}:${backendPort}/api`;

const supportTicketsService = {
  getAllTickets: async () => {
    try {
      const url = `${basePath}/support-tickets`;
      const response = await axios.get(url);
      return response.status === 200 
        ? { success: true, data: response.data } 
        : { success: false, error: "Error fetching tickets" };
    } catch (error) {
      return { success: false, error: "Network or server error" };
    }
  },

  createTicket: async (ticketData) => {
    try {
      const url = `${basePath}/support-tickets`;
      const response = await axios.post(url, ticketData);
      return response.status === 201 
        ? { success: true, data: response.data } 
        : { success: false, error: "Error creating ticket" };
    } catch (error) {
      return { success: false, error: error.response?.data || "Error creating ticket" };
    }
  },

  updateTicketStatus: async (ticketId, status) => {
    try {
      const url = `${basePath}/support-tickets/${ticketId}`;
      const response = await axios.put(url, { status });
      return response.status === 200 
        ? { success: true, data: response.data } 
        : { success: false, error: "Error updating ticket status" };
    } catch (error) {
      return { success: false, error: error.response?.data || "Error updating ticket status" };
    }
  },

  countTickets: async () => {
    try {
      const url = `${basePath}/support-tickets/count`;
      const response = await axios.get(url);
      return response.status === 200 
        ? { success: true, count: response.data.count } 
        : { success: false, error: "Error fetching ticket count" };
    } catch (error) {
      return { success: false, error: "Network or server error" };
    }
  }
};

export default supportTicketsService;
