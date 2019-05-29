'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('albums', 'createdAt', Sequelize.DATE),
      queryInterface.addColumn('albums', 'updatedAt', Sequelize.DATE),
      queryInterface.addColumn('artists', 'createdAt', Sequelize.DATE),
      queryInterface.addColumn('artists', 'updatedAt', Sequelize.DATE),
      queryInterface.addColumn('songs', 'createdAt', Sequelize.DATE),
      queryInterface.addColumn('songs', 'updatedAt', Sequelize.DATE),
      queryInterface.addColumn('songArtists', 'createdAt', Sequelize.DATE),
      queryInterface.addColumn('songArtists', 'updatedAt', Sequelize.DATE),
      queryInterface.addColumn('users', 'createdAt', Sequelize.DATE),
      queryInterface.addColumn('users', 'updatedAt', Sequelize.DATE),
      queryInterface.addColumn('playlists', 'createdAt', Sequelize.DATE),
      queryInterface.addColumn('playlists', 'updatedAt', Sequelize.DATE)
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('albums', 'createdAt'),
      queryInterface.removeColumn('albums', 'updatedAt'),
      queryInterface.removeColumn('artists', 'createdAt'),
      queryInterface.removeColumn('artists', 'updatedAt'),
      queryInterface.removeColumn('songs', 'createdAt'),
      queryInterface.removeColumn('songs', 'updatedAt'),
      queryInterface.removeColumn('songArtists', 'createdAt'),
      queryInterface.removeColumn('songArtists', 'updatedAt'),
      queryInterface.removeColumn('users', 'createdAt'),
      queryInterface.removeColumn('users', 'updatedAt'),
      queryInterface.removeColumn('playlists', 'createdAt'),
      queryInterface.removeColumn('playlists', 'updatedAt')
    ]);
  }
};
