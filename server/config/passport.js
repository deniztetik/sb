/// IGNORE- not being used at the moment ////

// var LocalStrategy    = require('passport-local').Strategy;
//
// var User             = require('../db/models/User.js');
//
// module.exports = function(passport) {
//   // for persistent user sessions
//   // still needs to be tested
//
//   passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });
//
//   passport.deserializeUser(function(id, done) {
//     User.where({id: id}).fetch()
//     .then(function(user) {
//       done(err, user);
//     });
//   });
//
//   passport.use('local-signup', new LocalStrategy({
//     // use email
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true // sends most of the req to the callback
//   },
//   function(req, email, password, done) {
//     User.where( { email: email } ).fetch()
//     .then(function(user) {
//       if (user) {
//         return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
//       } else {
//         new User({
//           email: email,
//           password: password
//         }).save();
//       }
//     });
//   }))
// }
