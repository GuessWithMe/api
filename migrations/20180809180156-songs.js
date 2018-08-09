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
  db.createTable('songs', {
    id: { type: 'bigint', primaryKey: true, autoIncrement: true },
    name: { type: 'string' },
    spotifyId: { type: 'string' },
    popularity: { type: 'integer' },
    previewUrl: { type: 'string' },
  });
  return null;
};

exports.down = function(db) {
  db.dropTable('songs');
  return null;
};

exports._meta = {
  "version": 1
};
