'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('playlists', 'userId', {
      type: Sequelize.BIGINT,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('playlists', 'userId');
  }
};
