// BooksList 렌더/삭제 흐름 테스트
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BooksList from './BooksList';
import { AlertProvider } from './Alert';
import { getBooks, deleteBook } from '../services/bookService';

vi.mock('../services/bookService');

const sampleBooks = [
  {
    entry_id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Non-Fiction',
    publication_date: '2008-08-01',
    isbn: '9780132350884',
  },
];

const renderList = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AlertProvider>
        <MemoryRouter>
          <BooksList />
        </MemoryRouter>
      </AlertProvider>
    </QueryClientProvider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  getBooks.mockResolvedValue({
    data: { books: sampleBooks, page: 1, totalPages: 1 },
  });
});

test('마운트 시 책 목록을 불러와 렌더한다', async () => {
  renderList();
  expect(await screen.findByText('Clean Code')).toBeInTheDocument();
  expect(getBooks).toHaveBeenCalled();
});

test('publication_date를 타임존 밀림 없이 표시한다', async () => {
  renderList();
  // 2008-08-01 이 7/31로 밀리지 않아야 함
  expect(
    await screen.findByText(new Date('2008-08-01T00:00:00').toLocaleDateString())
  ).toBeInTheDocument();
});

test('여러 페이지면 페이지 버튼을 누르면 해당 page로 다시 조회한다', async () => {
  getBooks.mockResolvedValue({
    data: { books: sampleBooks, page: 1, totalPages: 3 },
  });
  renderList();

  await screen.findByText('Clean Code');
  fireEvent.click(screen.getByRole('button', { name: '2' }));

  await waitFor(() =>
    expect(getBooks).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2, limit: 20 })
    )
  );
});

test('삭제 확인 시 deleteBook을 호출한다', async () => {
  deleteBook.mockResolvedValue({ data: { message: 'Book deleted successfully!' } });
  renderList();

  // 행 로드 대기 후 행의 Delete 클릭 → 모달 오픈
  await screen.findByText('Clean Code');
  fireEvent.click(screen.getByRole('button', { name: /delete/i }));

  // 모달 확인 버튼(두 번째 Delete) 클릭
  const deleteButtons = await screen.findAllByRole('button', { name: /^delete$/i });
  fireEvent.click(deleteButtons[deleteButtons.length - 1]);

  await waitFor(() => expect(deleteBook).toHaveBeenCalledWith(1));
});
