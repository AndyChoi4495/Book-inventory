// AddBookForm 검증/제출 동작 테스트
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddBookForm from './AddBookForm';
import { addBook } from '../services/bookService';

vi.mock('../services/bookService');

const renderForm = () =>
  render(
    <MemoryRouter>
      <AddBookForm />
    </MemoryRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
});

test('필수값 없이 제출하면 검증 에러를 보여주고 API를 호출하지 않는다', async () => {
  renderForm();

  fireEvent.click(screen.getByRole('button', { name: /add book/i }));

  expect(await screen.findByText('Title is required.')).toBeInTheDocument();
  expect(screen.getByText('Author is required.')).toBeInTheDocument();
  expect(addBook).not.toHaveBeenCalled();
});

test('유효한 입력을 제출하면 addBook을 호출한다', async () => {
  addBook.mockResolvedValue({ data: { message: 'Book added successfully!' } });
  renderForm();

  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: 'Clean Code' },
  });
  fireEvent.change(screen.getByLabelText(/author/i), {
    target: { value: 'Robert C. Martin' },
  });
  fireEvent.change(screen.getByLabelText(/publication date/i), {
    target: { value: '2008-08-01' },
  });
  fireEvent.change(screen.getByLabelText(/isbn/i), {
    target: { value: '9780132350884' },
  });

  fireEvent.click(screen.getByRole('button', { name: /add book/i }));

  await waitFor(() => expect(addBook).toHaveBeenCalledTimes(1));
  expect(addBook).toHaveBeenCalledWith(
    expect.objectContaining({ title: 'Clean Code', isbn: '9780132350884' })
  );
});
