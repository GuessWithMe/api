'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('songs', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      spotifyId: Sequelize.STRING,
      popularity: Sequelize.INTEGER,
      previewUrl: Sequelize.STRING,
      spotifyUrl: Sequelize.STRING,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('songs');
  }
};
