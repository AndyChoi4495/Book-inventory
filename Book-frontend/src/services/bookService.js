import api from './api';

export const addBook = (bookData) => {
    return api.post('/api/books', bookData);
};

export const getBooks = (filters) => {
    return api.get('/api/books', { params: filters });
};

export const exportBooks = (format) => {
    return api.get(`/api/books/export?format=${format}`, { responseType: 'blob' });
};
