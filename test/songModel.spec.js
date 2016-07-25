process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var knex = require('knex')(require('../server/config/bookshelf.config.js'));

var Song = require('../server/models/song');
var Songs = require('../server/collections/songs');


describe('Song Model and Collection', function() {
  beforeEach(function(done) {
    Song.where({ record:{'[foo]'} }).fetch()
      .then(function(song) {
        if (!song) {
          new Song ({
            record: '[foo]',
            title: 'bar'
          }).save().then(function() {
            done();
          });
        } else {
          done();
        }
      });
  });

  it('should contain a songs table', function(done) {
    Songs.fetch()
      .then(function(exists) {
        expect(exists).to.not.equal(null);
        done();
      });
  });

  it('should retrieve a model from the database', function(done) {
    Song.where({record: '[foo]'}).fetch()
      .then(function(song) {
        expect(song.get('title')).to.equal('bar');
        done();
      });
  });

});
