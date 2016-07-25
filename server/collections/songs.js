var db = require('../config/bookshelf.config.js');
var Song = require('../models/song');

var Songs = new db.Collection();

Songs.model = Song;

module.exports = Songs;
