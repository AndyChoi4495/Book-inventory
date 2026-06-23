// 책 입력 검증 규칙과 ISBN 정규식의 단일 출처 (모델·라우트가 공유)
const { body } = require('express-validator');

// ISBN-10 또는 ISBN-13 형식
const ISBN_REGEX = /^(97(8|9))?\d{9}(\d|X)$/i;

// POST/PUT가 공유하는 express-validator 규칙
const bookValidators = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 255 }),
  body('author')
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ max: 255 }),
  body('genre').notEmpty().withMessage('Genre is required').isLength({ max: 100 }),
  body('publication_date')
    .notEmpty()
    .withMessage('Publication Date is required')
    .isISO8601(),
  // .toDate() 미사용: DATEONLY에 'YYYY-MM-DD' 문자열을 그대로 저장(타임존 하루 밀림 방지)
  body('isbn')
    .notEmpty()
    .withMessage('ISBN is required')
    .matches(ISBN_REGEX)
    .withMessage('Invalid ISBN format')
    .isLength({ min: 10, max: 13 }),
];

module.exports = { ISBN_REGEX, bookValidators };
