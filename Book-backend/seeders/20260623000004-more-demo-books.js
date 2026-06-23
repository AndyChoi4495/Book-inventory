// 페이지네이션 확인용 추가 더미 책 40개 (ISBN은 978+10자리로 생성, undo 시 해당 ISBN만 삭제)
'use strict';

const now = new Date();
const genres = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Sci-Fi',
  'Fantasy',
  'Biography',
  'History',
  'Children',
  'Other',
];

// i=1..40 → isbn '978' + zero-padded 10자리 (CHECK 정규식 통과, 유니크)
const books = Array.from({ length: 40 }, (_, idx) => {
  const i = idx + 1;
  return {
    title: `Sample Book ${i}`,
    author: `Author ${i}`,
    genre: genres[idx % genres.length],
    publication_date: `${1990 + (idx % 30)}-${String((idx % 12) + 1).padStart(2, '0')}-15`,
    isbn: `978${String(i).padStart(10, '0')}`,
  };
});

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Inventory',
      books.map((b) => ({ ...b, createdAt: now, updatedAt: now })),
      { ignoreDuplicates: true }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Inventory', {
      isbn: { [Sequelize.Op.in]: books.map((b) => b.isbn) },
    });
  },
};
