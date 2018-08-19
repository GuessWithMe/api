'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      spotifyUsername: Sequelize.STRING,
      spotifyId: Sequelize.STRING,
      spotifyAccessToken: Sequelize.STRING,
      spotifyRefreshToken: Sequelize.STRING,
      spotifyDisplayName: Sequelize.STRING,
      spotifyImageUrl: Sequelize.STRING,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
