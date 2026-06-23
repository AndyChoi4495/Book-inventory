// 비동기 핸들러 래퍼와 중앙 에러 처리 미들웨어 (try/catch 반복 제거)
// async 컨트롤러를 감싸 예외를 next(err)로 전달
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// 매칭되는 라우트가 없을 때
const notFound = (req, res) => {
  res.status(404).json({ errors: [{ msg: 'Route not found.' }] });
};

// 예기치 못한 에러를 일관된 JSON으로 응답
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ errors: [{ msg: 'Server Error' }] });
};

module.exports = { asyncHandler, notFound, errorHandler };
