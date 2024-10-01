import React, { useState } from 'react';
import { Form, Button, Alert as BootstrapAlert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddBookForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: 'Fiction',
        publication_date: '',
        isbn: '',
    });
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState('');

    const genres = [
        'Fiction',
        'Non-Fiction',
        'Mystery',
        'Sci-Fi',
        'Fantasy',
        'Biography',
        'History',
        'Children',
        'Other',
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateISBN = (isbn) => {
        // Simple ISBN-10 or ISBN-13 validation
        const regex = /^(97(8|9))?\d{9}(\d|X)$/i;
        return regex.test(isbn);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setSuccess('');

        const { title, author, genre, publication_date, isbn } = formData;
        const validationErrors = [];

        if (!title) validationErrors.push('Title is required.');
        if (!author) validationErrors.push('Author is required.');
        if (!genre) validationErrors.push('Genre is required.');
        if (!publication_date) validationErrors.push('Publication Date is required.');
        if (!isbn) {
            validationErrors.push('ISBN is required.');
        } else if (!validateISBN(isbn)) {
            validationErrors.push('Invalid ISBN format.');
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Submit Data to Backend
        try {
            const response = await axios.post('http://localhost:5000/api/books', formData);
            setSuccess(response.data.message);
            setFormData({
                title: '',
                author: '',
                genre: 'Fiction',
                publication_date: '',
                isbn: '',
            });
            // Redirect to books list after a delay
            setTimeout(() => {
                navigate('/books');
            }, 1000);
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const backendErrors = error.response.data.errors.map((err) => err.msg);
                setErrors(backendErrors);
            } else {
                setErrors(['An unexpected error occurred. Please try again.']);
            }
        }
    };

    return (
        <div>
            <h2>Add New Book</h2>
            {errors.length > 0 && (
                <BootstrapAlert variant="danger">
                    <ul>
                        {errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                </BootstrapAlert>
            )}
            {success && <BootstrapAlert variant="success">{success}</BootstrapAlert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle" className="mb-3">
                    <Form.Label>Title *</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter book title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formAuthor" className="mb-3">
                    <Form.Label>Author *</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter author name"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formGenre" className="mb-3">
                    <Form.Label>Genre *</Form.Label>
                    <Form.Select name="genre" value={formData.genre} onChange={handleChange}>
                        {genres.map((genreOption, idx) => (
                            <option key={idx} value={genreOption}>
                                {genreOption}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formPublicationDate" className="mb-3">
                    <Form.Label>Publication Date *</Form.Label>
                    <Form.Control
                        type="date"
                        name="publication_date"
                        value={formData.publication_date}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formISBN" className="mb-3">
                    <Form.Label>ISBN *</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter ISBN"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                    />
                    <Form.Text className="text-muted">ISBN-10 or ISBN-13 format.</Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Add Book
                </Button>
            </Form>
        </div>
    );
}

export default AddBookForm;
