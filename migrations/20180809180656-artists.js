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
  db.createTable('artists', {
    id: { type: 'bigint', primaryKey: true, autoIncrement: true },
    name: { type: 'string' },
    songId: {
      type: 'bigint',
      foreignKey: {
        name: 'artists_song_foreign',
        table: 'songs',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        }
      }
    }
  });
  return null;
};

exports.down = function(db) {
  db.dropTable('artists')
  return null;
};

exports._meta = {
  "version": 1
};
