// /api/books 라우트 정의 (핸들러는 controllers/bookController.js)
const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookController');
const { bookValidators } = require('../utils/validation');

router.post('/', bookValidators, controller.createBook);
router.get('/', controller.getBooks);
// /export 는 반드시 /:id 보다 먼저 등록 (그래야 :id가 'export'를 가로채지 않음)
router.get('/export', controller.exportBooks);
router.get('/:id', controller.getBookById);
router.put('/:id', bookValidators, controller.updateBook);
router.delete('/:id', controller.deleteBook);

module.exports = router;
