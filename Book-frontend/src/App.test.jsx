// App 스모크 테스트: '/' 진입 시 BooksList로 이동해 제목이 보인다
import { render, screen } from '@testing-library/react';
import App from './App';
import { getBooks } from './services/bookService';

vi.mock('./services/bookService');

test('앱이 렌더되고 Book Inventory 화면을 보여준다', async () => {
  getBooks.mockResolvedValue({ data: { books: [] } });
  render(<App />);
  expect(
    await screen.findByRole('heading', { name: 'Book Inventory' })
  ).toBeInTheDocument();
});
