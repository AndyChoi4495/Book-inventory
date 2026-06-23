// 책 CRUD 비즈니스 로직 (라우트는 routes/bookRoutes.js)
const { validationResult } = require('express-validator');
const { Parser } = require('json2csv');
const { Op } = require('sequelize');
const Inventory = require('../models/inventory');
const { asyncHandler } = require('../middleware/errorHandler');

// 1. 책 추가
exports.createBook = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, author, genre, publication_date, isbn } = req.body;

  const existingBook = await Inventory.findOne({ where: { isbn } });
  if (existingBook) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'A book with this ISBN already exists.' }] });
  }

  const newBook = await Inventory.create({
    title,
    author,
    genre,
    publication_date,
    isbn,
  });

  return res
    .status(201)
    .json({ message: 'Book added successfully!', book: newBook });
});

// 2. 책 목록/필터 (페이지네이션: page, limit 기본 30)
exports.getBooks = asyncHandler(async (req, res) => {
  const { title, author, genre, publication_date } = req.query;

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
  const offset = (page - 1) * limit;

  const query = {};
  if (title) {
    query.title = { [Op.iLike]: `%${title}%` };
  }
  if (author) {
    query.author = { [Op.iLike]: `%${author}%` };
  }
  if (genre) {
    query.genre = genre;
  }
  if (publication_date) {
    query.publication_date = publication_date;
  }

  const { count, rows } = await Inventory.findAndCountAll({
    where: query,
    limit,
    offset,
    order: [['entry_id', 'ASC']],
  });

  return res.json({
    count, // 필터 조건에 맞는 전체 건수
    page,
    totalPages: Math.ceil(count / limit),
    books: rows,
  });
});

// 3. 데이터 내보내기 (CSV/JSON)
exports.exportBooks = asyncHandler(async (req, res) => {
  const { format } = req.query;

  if (!['csv', 'json'].includes((format || '').toLowerCase())) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'Invalid export format. Choose CSV or JSON.' }] });
  }

  const books = await Inventory.findAll();

  if (format.toLowerCase() === 'json') {
    return res.json({ count: books.length, books });
  }

  const fields = ['entry_id', 'title', 'author', 'genre', 'publication_date', 'isbn'];
  const parser = new Parser({ fields });
  const csv = parser.parse(books.map((book) => book.toJSON()));

  res.header('Content-Type', 'text/csv');
  res.attachment('books_inventory.csv');
  return res.send(csv);
});

// 4. 단건 조회 (편집 폼 프리필용)
exports.getBookById = asyncHandler(async (req, res) => {
  const book = await Inventory.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({ errors: [{ msg: 'Book not found.' }] });
  }
  return res.json({ book });
});

// 5. 책 수정
exports.updateBook = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, author, genre, publication_date, isbn } = req.body;

  const book = await Inventory.findByPk(id);
  if (!book) {
    return res.status(404).json({ errors: [{ msg: 'Book not found.' }] });
  }

  // 다른 책이 같은 ISBN을 쓰는지 검사 (자기 자신 제외)
  const duplicate = await Inventory.findOne({
    where: { isbn, entry_id: { [Op.ne]: id } },
  });
  if (duplicate) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'A book with this ISBN already exists.' }] });
  }

  await book.update({ title, author, genre, publication_date, isbn });
  return res.json({ message: 'Book updated successfully!', book });
});

// 6. 책 삭제
exports.deleteBook = asyncHandler(async (req, res) => {
  const deleted = await Inventory.destroy({
    where: { entry_id: req.params.id },
  });
  if (!deleted) {
    return res.status(404).json({ errors: [{ msg: 'Book not found.' }] });
  }
  return res.json({ message: 'Book deleted successfully!' });
});
