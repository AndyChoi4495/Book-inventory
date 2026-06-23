// 프론트엔드 책 폼 검증 규칙의 단일 출처 (백엔드가 권위 검증, 여기선 즉시 피드백용)

// ISBN-10 또는 ISBN-13 형식 (백엔드 utils/validation.js와 동일 규칙)
export const ISBN_REGEX = /^(97(8|9))?\d{9}(\d|X)$/i;

// 책 폼 데이터를 검증해 에러 메시지 배열을 반환 (비어있으면 통과)
export const validateBookForm = ({ title, author, genre, publication_date, isbn }) => {
  const errors = [];
  if (!title) errors.push('Title is required.');
  if (!author) errors.push('Author is required.');
  if (!genre) errors.push('Genre is required.');
  if (!publication_date) errors.push('Publication Date is required.');
  if (!isbn) {
    errors.push('ISBN is required.');
  } else if (!ISBN_REGEX.test(isbn)) {
    errors.push('Invalid ISBN format.');
  }
  return errors;
};
