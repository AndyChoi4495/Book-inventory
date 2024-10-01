import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import FilterBooksForm from './FilterBooksForm';
import ExportButton from './ExportButton';

function BooksList() {
    const [books, setBooks] = useState([]);
    const [filterData, setFilterData] = useState({
        title: '',
        author: '',
        genre: '',
        publication_date: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchBooks = async (isReset = false) => {
        setLoading(true);
        setError('');
        try {
            const params = {};

            if (!isReset) {
                if (filterData.title) params.title = filterData.title;
                if (filterData.author) params.author = filterData.author;
                if (filterData.genre) params.genre = filterData.genre;
                if (filterData.publication_date) params.publication_date = filterData.publication_date;
            }

            const response = await axios.get('http://localhost:5000/api/books', { params });
            setBooks(response.data.books);
        } catch (err) {
            setError('Failed to fetch books. Please try again later.');
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleFilter = (isReset = false) => {
        fetchBooks(isReset);
    };

    return (
        <div>
            <h2>Book Inventory</h2>
            <FilterBooksForm formData={filterData} setFormData={setFilterData} handleFilter={handleFilter} />
            <div className="d-flex justify-content-end my-3">
                <ExportButton />
            </div>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status" />
                </div>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : books.length > 0 ? (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>Entry ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Genre</th>
                            <th>Publication Date</th>
                            <th>ISBN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.entry_id}>
                                <td>{book.entry_id}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{book.genre}</td>
                                <td>{new Date(book.publication_date).toLocaleDateString()}</td>
                                <td>{book.isbn}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No books found.</p>
            )}
        </div>
    );
}

export default BooksList;
