import React, { useState, useEffect } from 'react';
import { Form, Button, Alert as BootstrapAlert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { addBook, getBook, updateBook } from '../services/bookService';
import { validateBookForm } from '../utils/validation';

function AddBookForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'Fiction',
    publication_date: '',
    isbn: '',
  });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  // 편집 모드면 기존 책 데이터로 폼 프리필
  useEffect(() => {
    if (!isEdit) return;
    getBook(id)
      .then((response) => {
        const book = response.data.book;
        setFormData({
          title: book.title,
          author: book.author,
          genre: book.genre,
          publication_date: book.publication_date,
          isbn: book.isbn,
        });
      })
      .catch(() => {
        setErrors(['Failed to load the book. It may have been deleted.']);
      });
  }, [id, isEdit]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');

    const validationErrors = validateBookForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit Data to Backend
    try {
      const response = isEdit
        ? await updateBook(id, formData)
        : await addBook(formData);
      setSuccess(response.data.message);
      if (!isEdit) {
        setFormData({
          title: '',
          author: '',
          genre: 'Fiction',
          publication_date: '',
          isbn: '',
        });
      }
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
      <h2>{isEdit ? 'Edit Book' : 'Add New Book'}</h2>
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
          {isEdit ? 'Update Book' : 'Add Book'}
        </Button>
      </Form>
    </div>
  );
}

export default AddBookForm;
