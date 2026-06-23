// Inventory 테이블 초기 스키마 (기존 DB에서는 baseline 처리되어 실행되지 않음)
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inventory', {
      entry_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      genre: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      publication_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      isbn: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
    });

    // ISBN 형식 CHECK 제약 (README SQL과 동일 규칙)
    await queryInterface.sequelize.query(
      `ALTER TABLE "Inventory" ADD CONSTRAINT "inventory_isbn_check" CHECK (isbn ~ '^(97(8|9))?\\d{9}(\\d|X)$')`
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Inventory');
  },
};
