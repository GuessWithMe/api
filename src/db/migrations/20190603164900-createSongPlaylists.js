'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('songPlaylists', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      songId: {
        type: Sequelize.BIGINT,
        references: { model: 'songs', key: 'id' }
      },
      playlistId: {
        type: Sequelize.BIGINT,
        references: { model: 'playlists', key: 'id' }
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('songPlaylists');
  }
};
