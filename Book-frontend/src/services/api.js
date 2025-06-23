import axios from 'axios';

const api = axios.create({
    baseURL: 'https://book-inventory-go7b.onrender.com/5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
