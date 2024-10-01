const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
                is: /^(97(8|9))?\d{9}(\d|X)$/i, // Basic ISBN-10 or ISBN-13 validation
            },
        },
    },
    {
        tableName: 'Inventory',
        timestamps: false, // Disable createdAt and updatedAt
    }
);

module.exports = Inventory;
