import axios from "axios";

const API_URL = "http://localhost:3000/api/auth"; 

export const authService = {
    register: async (username, email, password) => {
        const res = await axios.post(`${API_URL}/register`, { username, email, password });
        return res.data;
    },

    login: async (email, password) => {
        const res = await axios.post(`${API_URL}/login`, { email, password });
        return res.data; 
    },
    
    getMe: async (token) => {
        const res = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    }
};