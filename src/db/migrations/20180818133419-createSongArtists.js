'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('songArtists', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      songId: {
        type: Sequelize.BIGINT,
        references: { model: 'songs', key: 'id' }
      },
      artistId: {
        type: Sequelize.BIGINT,
        references: { model: 'artists', key: 'id' }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('songArtists');
  }
};
