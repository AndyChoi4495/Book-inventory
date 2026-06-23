// /api/books 엔드포인트 통합 테스트 (모델 mock으로 실DB 미접속)
const request = require('supertest');

// 실제 Supabase에 붙지 않도록 모델 전체를 mock
jest.mock('../models/inventory', () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
  findAndCountAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
}));

const Inventory = require('../models/inventory');
const app = require('../index');

const validBook = {
  title: 'Clean Code',
  author: 'Robert C. Martin',
  genre: 'Non-Fiction',
  publication_date: '2008-08-01',
  isbn: '9780132350884',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /api/books', () => {
  it('유효한 책을 추가하면 201', async () => {
    Inventory.findOne.mockResolvedValue(null);
    Inventory.create.mockResolvedValue({ entry_id: 1, ...validBook });

    const res = await request(app).post('/api/books').send(validBook);

    expect(res.status).toBe(201);
    expect(res.body.book).toMatchObject({ entry_id: 1, isbn: validBook.isbn });
    expect(Inventory.create).toHaveBeenCalledTimes(1);
  });

  it('중복 ISBN이면 400', async () => {
    Inventory.findOne.mockResolvedValue({ entry_id: 9, ...validBook });

    const res = await request(app).post('/api/books').send(validBook);

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toMatch(/already exists/i);
    expect(Inventory.create).not.toHaveBeenCalled();
  });

  it('필수값 누락이면 400', async () => {
    const res = await request(app).post('/api/books').send({});
    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('잘못된 ISBN 형식이면 400', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({ ...validBook, isbn: 'not-an-isbn' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => /ISBN/i.test(e.msg))).toBe(true);
  });
});

describe('GET /api/books', () => {
  it('count/page/totalPages/books를 반환', async () => {
    Inventory.findAndCountAll.mockResolvedValue({
      count: 1,
      rows: [{ entry_id: 1, ...validBook }],
    });

    const res = await request(app).get('/api/books');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.books).toHaveLength(1);
  });

  it('page/limit로 페이지네이션 (offset 계산 + totalPages)', async () => {
    Inventory.findAndCountAll.mockResolvedValue({ count: 45, rows: [] });

    const res = await request(app).get('/api/books?page=2&limit=30');

    expect(res.status).toBe(200);
    expect(res.body.page).toBe(2);
    expect(res.body.totalPages).toBe(2); // ceil(45/30)
    expect(Inventory.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 30, offset: 30 })
    );
  });
});

describe('GET /api/books/export', () => {
  it('format=json이면 200 (그리고 :id에 안 잡힘)', async () => {
    Inventory.findAll.mockResolvedValue([]);

    const res = await request(app).get('/api/books/export?format=json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('count');
    expect(Inventory.findByPk).not.toHaveBeenCalled();
  });

  it('형식 누락이면 400', async () => {
    const res = await request(app).get('/api/books/export');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/books/:id', () => {
  it('존재하면 200', async () => {
    Inventory.findByPk.mockResolvedValue({ entry_id: 1, ...validBook });
    const res = await request(app).get('/api/books/1');
    expect(res.status).toBe(200);
    expect(res.body.book.entry_id).toBe(1);
  });

  it('없으면 404', async () => {
    Inventory.findByPk.mockResolvedValue(null);
    const res = await request(app).get('/api/books/999');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/books/:id', () => {
  it('수정 성공이면 200', async () => {
    const update = jest.fn().mockResolvedValue(true);
    Inventory.findByPk.mockResolvedValue({ entry_id: 1, ...validBook, update });
    Inventory.findOne.mockResolvedValue(null); // 중복 없음

    const res = await request(app)
      .put('/api/books/1')
      .send({ ...validBook, title: 'Updated' });

    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalledTimes(1);
  });

  it('대상이 없으면 404', async () => {
    Inventory.findByPk.mockResolvedValue(null);
    const res = await request(app).put('/api/books/999').send(validBook);
    expect(res.status).toBe(404);
  });

  it('다른 책이 같은 ISBN을 쓰면 400', async () => {
    Inventory.findByPk.mockResolvedValue({ entry_id: 1, ...validBook, update: jest.fn() });
    Inventory.findOne.mockResolvedValue({ entry_id: 2, ...validBook }); // 다른 책 중복

    const res = await request(app).put('/api/books/1').send(validBook);

    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toMatch(/already exists/i);
  });
});

describe('DELETE /api/books/:id', () => {
  it('삭제 성공이면 200', async () => {
    Inventory.destroy.mockResolvedValue(1);
    const res = await request(app).delete('/api/books/1');
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it('없으면 404', async () => {
    Inventory.destroy.mockResolvedValue(0);
    const res = await request(app).delete('/api/books/999');
    expect(res.status).toBe(404);
  });
});

describe('알 수 없는 라우트', () => {
  it('404 JSON', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body.errors[0].msg).toMatch(/not found/i);
  });
});
