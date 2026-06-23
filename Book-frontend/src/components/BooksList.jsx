import React, { useState } from 'react';
import { Table, Spinner, Button, Modal, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { getBooks, deleteBook } from '../services/bookService';
import { useAlert } from './Alert';
import FilterBooksForm from './FilterBooksForm';
import ExportButton from './ExportButton';

const PAGE_SIZE = 20;

// 빈 값 제거한 적용 필터만 추림
const buildFilters = (formData) => {
  const filters = {};
  if (formData.title) filters.title = formData.title;
  if (formData.author) filters.author = formData.author;
  if (formData.genre) filters.genre = formData.genre;
  if (formData.publication_date) filters.publication_date = formData.publication_date;
  return filters;
};

function BooksList() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();

  const [filterData, setFilterData] = useState({
    title: '',
    author: '',
    genre: '',
    publication_date: '',
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [page, setPage] = useState(1);
  const [bookToDelete, setBookToDelete] = useState(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ['books', page, appliedFilters],
    queryFn: () =>
      getBooks({ page, limit: PAGE_SIZE, ...appliedFilters }).then((res) => res.data),
    placeholderData: keepPreviousData, // 페이지 전환 시 이전 데이터 유지(깜빡임 방지)
  });

  const books = data?.books || [];
  const totalPages = data?.totalPages || 1;

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBook(id),
    onSuccess: () => {
      showAlert('Book deleted successfully!', 'success');
      // 마지막 페이지의 마지막 항목을 지우면 이전 페이지로(아니면 현재 페이지 무효화)
      if (books.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        queryClient.invalidateQueries({ queryKey: ['books'] });
      }
    },
    onError: (err) => {
      console.error(err);
      showAlert('Failed to delete the book.', 'danger');
    },
    onSettled: () => setBookToDelete(null),
  });

  const handleFilter = (isReset = false) => {
    setAppliedFilters(isReset ? {} : buildFilters(filterData));
    setPage(1); // 필터 변경 시 1페이지부터
  };

  const goToPage = (target) => {
    if (target < 1 || target > totalPages || target === page) return;
    setPage(target);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(bookToDelete.entry_id);
  };

  const loading = isPending;
  const error = isError ? 'Failed to fetch books. Please try again later.' : '';

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

      {!loading && !error && totalPages > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.Prev
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
          />
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Pagination.Item
              key={p}
              active={p === page}
              onClick={() => goToPage(p)}
            >
              {p}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
          />
        </Pagination>
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
