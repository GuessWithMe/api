'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('playlists', 'totalSongsAtLastImport', Sequelize.INTEGER),
      queryInterface.addColumn('playlists', 'eligibleSongsAtLastImport', Sequelize.INTEGER)
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('playlists', 'songAmountAtLastImport'),
      queryInterface.removeColumn('playlists', 'eligibleSongsAtLastImport')
    ]);
  }
};
