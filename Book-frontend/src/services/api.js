import axios from 'axios';

const api = axios.create({
  baseURL: process.env.BACKEND_URL || 'http://localhost:5009',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
