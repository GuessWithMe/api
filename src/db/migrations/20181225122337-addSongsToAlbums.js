'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('songs', 'albumId', {
      type: Sequelize.BIGINT,
      references: { model: 'albums', key: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'RESTRICT',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('songs', 'albumId');
  }
};
