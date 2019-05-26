'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('playlists', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      spotifyId: Sequelize.STRING,
      lastImportAt: Sequelize.DATE
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('playlists');
  }
};
