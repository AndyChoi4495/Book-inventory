import React, { useState, useEffect } from 'react';
import { Table, Spinner, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getBooks, deleteBook } from '../services/bookService';
import { useAlert } from './Alert';
import FilterBooksForm from './FilterBooksForm';
import ExportButton from './ExportButton';

function BooksList() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [books, setBooks] = useState([]);
  const [filterData, setFilterData] = useState({
    title: '',
    author: '',
    genre: '',
    publication_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookToDelete, setBookToDelete] = useState(null);

  const fetchBooks = async (isReset = false) => {
    setLoading(true);
    setError('');
    try {
      const params = {};

      if (!isReset) {
        if (filterData.title) params.title = filterData.title;
        if (filterData.author) params.author = filterData.author;
        if (filterData.genre) params.genre = filterData.genre;
        if (filterData.publication_date)
          params.publication_date = filterData.publication_date;
      }

      const response = await getBooks(params);
      setBooks(response.data.books || []);
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (isReset = false) => {
    fetchBooks(isReset);
  };

  const confirmDelete = async () => {
    try {
      await deleteBook(bookToDelete.entry_id);
      showAlert('Book deleted successfully!', 'success');
      setBookToDelete(null);
      fetchBooks();
    } catch (err) {
      console.error(err);
      showAlert('Failed to delete the book.', 'danger');
      setBookToDelete(null);
    }
  };

  return (
    <div>
      <h2>Book Inventory</h2>
      <FilterBooksForm
        formData={filterData}
        setFormData={setFilterData}
        handleFilter={handleFilter}
      />
      <div className="d-flex justify-content-end my-3">
        <ExportButton />
      </div>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : books && books.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Entry ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Publication Date</th>
              <th>ISBN</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.entry_id}>
                <td>{book.entry_id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{new Date(`${book.publication_date}T00:00:00`).toLocaleDateString()}</td>
                <td>{book.isbn}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/edit/${book.entry_id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setBookToDelete(book)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No books found.</p>
      )}

      <Modal show={Boolean(bookToDelete)} onHide={() => setBookToDelete(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{' '}
          <strong>{bookToDelete?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setBookToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BooksList;
