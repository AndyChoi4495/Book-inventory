import api from './api';

export const addBook = (bookData) => {
    return api.post('/api/books', bookData);
};

export const getBooks = (filters) => {
    return api.get('/api/books', { params: filters });
};

export const getBook = (id) => {
    return api.get(`/api/books/${id}`);
};

export const updateBook = (id, bookData) => {
    return api.put(`/api/books/${id}`, bookData);
};

export const deleteBook = (id) => {
    return api.delete(`/api/books/${id}`);
};

export const exportBooks = (format) => {
    return api.get(`/api/books/export?format=${format}`, { responseType: 'blob' });
};
