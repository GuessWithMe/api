'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'users',
      'tokenExpiresAt',
      Sequelize.DATE
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'users',
      'tokenExpiresAt'
    )
  }
};
