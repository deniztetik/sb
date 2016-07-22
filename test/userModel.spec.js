process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var knex = require('knex')(require('../server/config/bookshelf.config.js'));

var User = require('../server/models/user');
var Users = require('../server/collections/users');


describe('User Route', function() {
  beforeEach(function(done) {
    User.where({ email: 'test@test.com' }).fetch()
      .then(function(user) {
        if (!user) {
          new User ({
            email: 'test@test.com',
            password: 'defconbravo'
          }).save().then(function() {
            done();
          });
        } else {
          done();
        }
      });
  });

  it('should contain a users table', function(done) {
    Users.fetch()
      .then(function(exists) {
        expect(exists).to.not.equal(null);
        done();
      });
  });

  it('should retrieve a model from the database', function(done) {
    User.where({email: 'test@test.com'}).fetch()
      .then(function(user) {
        expect(user.get('email')).to.equal('test@test.com');
        done();
      });
  });

  // after(function (done) {
  //   return knex.migrate.rollback()
  //     .then(function() {
  //       done();
  //     });
  // });
});
