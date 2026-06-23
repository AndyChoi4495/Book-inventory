// 데모용 더미 책 20개 시드 (undo 시 해당 ISBN만 삭제)
'use strict';

const now = new Date();

const books = [
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'Non-Fiction', publication_date: '1999-10-30', isbn: '9780201616224' },
  { title: 'Clean Code', author: 'Robert C. Martin', genre: 'Non-Fiction', publication_date: '2008-08-01', isbn: '9780132350884' },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', publication_date: '1937-09-21', isbn: '9780547928227' },
  { title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', publication_date: '1965-08-01', isbn: '9780441013593' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History', publication_date: '2011-01-01', isbn: '9780062316097' },
  { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', genre: 'Mystery', publication_date: '2005-08-01', isbn: '9780307454546' },
  { title: 'Steve Jobs', author: 'Walter Isaacson', genre: 'Biography', publication_date: '2011-10-24', isbn: '9781451648539' },
  { title: 'The Very Hungry Caterpillar', author: 'Eric Carle', genre: 'Children', publication_date: '1969-06-03', isbn: '9780399226908' },
  { title: '1984', author: 'George Orwell', genre: 'Fiction', publication_date: '1949-06-08', isbn: '9780451524935' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', publication_date: '1960-07-11', isbn: '9780061120084' },
  { title: 'The Martian', author: 'Andy Weir', genre: 'Sci-Fi', publication_date: '2014-02-11', isbn: '9780553418026' },
  { title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Mystery', publication_date: '2012-06-05', isbn: '9780307588371' },
  { title: 'A Brief History of Time', author: 'Stephen Hawking', genre: 'Non-Fiction', publication_date: '1988-04-01', isbn: '9780553380163' },
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss', genre: 'Fantasy', publication_date: '2007-03-27', isbn: '9780756404741' },
  { title: 'Educated', author: 'Tara Westover', genre: 'Biography', publication_date: '2018-02-20', isbn: '9780399590504' },
  { title: 'The Guns of August', author: 'Barbara W. Tuchman', genre: 'History', publication_date: '1962-01-01', isbn: '9780345476098' },
  { title: 'Where the Wild Things Are', author: 'Maurice Sendak', genre: 'Children', publication_date: '1963-11-13', isbn: '9780064431781' },
  { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', publication_date: '1988-01-01', isbn: '9780062315007' },
  { title: 'Atomic Habits', author: 'James Clear', genre: 'Other', publication_date: '2018-10-16', isbn: '9780735211292' },
  { title: 'Neuromancer', author: 'William Gibson', genre: 'Sci-Fi', publication_date: '1984-07-01', isbn: '9780441569595' },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Inventory',
      books.map((b) => ({ ...b, createdAt: now, updatedAt: now })),
      { ignoreDuplicates: true } // 재실행 시 중복 ISBN 무시
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Inventory', {
      isbn: { [Sequelize.Op.in]: books.map((b) => b.isbn) },
    });
  },
};
