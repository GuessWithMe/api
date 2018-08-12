'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.createTable('users', {
    id: { type: 'bigint', primaryKey: true, autoIncrement: true },
    spotifyUsername: { type: 'string' },
    spotifyId: { type: 'string' },
    spotifyAccessToken: { type: 'string' },
    spotifyRefreshToken: { type: 'string' },
    spotifyDisplayName: { type: 'string' },
    spotifyImageUrl: { type: 'string' },
  });

  return null;
};

exports.down = function(db) {
  db.dropTable('users');
  return null;
};

exports._meta = {
  "version": 1
};
