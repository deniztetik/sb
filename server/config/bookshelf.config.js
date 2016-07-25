
var path = require('path');

// var knex = require('knex')({            //Uncomment this to make this file work locally
//   client: 'sqlite3',
//   connection: {filename: './data/data.db'},
//   useNullAsDefault: true
// });


var db = require('knex')({
  client: 'postgresql',
  connection: process.env.DATABASE_URL
});

db.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('email', 100).unique();
      user.string('password', 100);
      user.string('name', 100);
      user.timestamps();
    }).then(function () {
      console.log('Created users table');
    });
  }
});
db.schema.hasTable('songs').then(function(exists) {
  if (!exists) {
    db.schema.createTable('songs', function (song) {
      song.increments('id').primary();
      song.string('record', 400);
      song.string('title', 100);
    }).then(function () {
      console.log('Created songs table');
    });
  }
});
var Bookshelf = require('bookshelf')(db);
module.exports = Bookshelf;
