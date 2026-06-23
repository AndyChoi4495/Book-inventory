// models/inventory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { ISBN_REGEX } = require('../utils/validation');

const Inventory = sequelize.define(
  'Inventory',
  {
    entry_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    publication_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        is: ISBN_REGEX, // utils/validation.js의 단일 출처 정규식
      },
    },
  },
  {
    tableName: 'Inventory',
    timestamps: true, // createdAt/updatedAt (마이그레이션으로 컬럼 추가됨)
  }
);

module.exports = Inventory;
