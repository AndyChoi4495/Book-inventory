// Inventory에 createdAt/updatedAt 추가 (감사용). 기존 행은 NOW()로 채움.
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Inventory', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()'),
    });
    await queryInterface.addColumn('Inventory', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()'),
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Inventory', 'updatedAt');
    await queryInterface.removeColumn('Inventory', 'createdAt');
  },
};
