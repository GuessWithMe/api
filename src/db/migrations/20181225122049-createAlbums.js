'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('albums', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      spotifyId: Sequelize.STRING,
      imageUrl: Sequelize.STRING,
      releaseDate: Sequelize.DATE,
      spotifyUrl: Sequelize.STRING,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('albums');
  }
};
