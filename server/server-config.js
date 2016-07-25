var express = require('express');
var fs = require('fs');
var path = require('path');

var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var app = express();

var User = require('./models/user');
var Song = require('./models/song');


// for development
app.use(morgan('dev'));
app.use(cookieParser()); // to read cookies
app.use(bodyParser()); // read forms

// passport stuff
app.use(session({ secret: 'bourbonistasty' }));
app.use(passport.initialize());
app.use(passport.session()); // persistence
app.use(flash()); // display flash messages

// set a normalized path to public.
var rootPath = path.normalize(__dirname + '/../public');

// set paths from this directory to the others that are serving static files to client.
// note that the script tags in index.html are simplified as a result.
app.use('/dist', express.static(__dirname + '/../dist/'));
app.use('/soundfiles', express.static(__dirname + '/../foley/'));
// TODO: create instruments dir
app.use('/piano', express.static(__dirname + '/../piano/'));
app.use('/node_modules', express.static(__dirname + '/../node_modules/'));
app.use('/compiled', express.static(__dirname + '/../compiled/'));
app.use('/styles', express.static(__dirname + '/../public/components/styles/'));
app.use('/assets', express.static(__dirname + '/assets/'));

// At root, send index.html. It's location is appended to the rootPath.
app.get('/', function(req, res) {
  res.sendFile(path.join(rootPath + '/index.html'));
});

// post for '/login'. if successful adds a user object to session
app.post('/login', function(req, res) {
  var userEmail    = req.body.email;
  var userPassword = req.body.password;

  // fetch username by email, check password
  new User({email: userEmail}).fetch()
    .then(function(user) {
      if (!user) {
        // send response with flash, username doesn't exist
        res.send(401, "username doesn't exist!");
      } else {
        //check password
        user.comparePassword(userPassword, function(matches) {
          if (matches) {
            // log in
            // front-end: replace login button with logout button
            req.session.user = {id: user.get('id'), name: user.get('name')};
            console.log(req.session.user);
            res.send(200, req.session.user.name);
          } else {
            //send response with flash, wrong password
            res.send(401, "wrong password!");
          }
        });
      }
    });
});

// post for '/signup', if successful adds user to db
app.post('/signup', function(req, res) {
  var userEmail    = req.body.email;
  var userPassword = req.body.password;
  var userName     = req.body.name;

  new User({email: userEmail}).fetch()
    .then(function(user) {
      if (!user) {
        // username available, add user!
        // add user to session
        new User({email: userEmail, password: userPassword, name: userName}).save();
        req.session.user = new User({email: userEmail}).fetch().get('id');
        res.send(200);
      } else {
        res.send(401, "username taken!");
      }
    });
});

//returns an array of all the sounds in foley folder
app.get('/default', function (req, res) {
  fs.readdir(path.join(__dirname + '/../foley/'), function(err, files) {
    if (err) console.error(err);
    res.send(files);
  });
});

app.get('/piano', function (req, res) {
  fs.readdir(path.join(__dirname + '/../piano/'), function(err, files) {
    if (err) console.error(err);
    res.send(files);
  });
});

app.get('/presets', function(req, res) {
  var presets = [['Null Filter', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ['Bass Reducer', -25, -25, -25, 0, 0, 0, 0, 0, 0, 0],
  ['Bass Booster', 25, 25, 25, 0, 0, 0, 0, 0, 0, 0]];
  res.send(presets);
})

app.post('/saveSong', function(req,res){
  var record = req.body.record;
  var title = req.body.title;
  new Song({record: record, title:title}).save();
  res.send(200);
});

app.get('/getSonglibrary', function(req,res){
   Song.fetchAll().then(function(data){
    res.send(data)
  }).catch(function(err){
    console.error(err);
  })
});

app.get('/defaults', function (req, res) {
  // var defaults = {
  //   97: "/piano/c.wav",
  //   119: "/piano/cH.wav",
  //   115: "/piano/d.wav",
  //   101: "/piano/eb.wav",
  //   100: "/piano/e.wav",
  //   102: "/piano/f.wav",
  //   116: "/piano/fH.wav",
  //   103: "/piano/g.wav",
  //   121: "/piano/gH.wav",
  //   104: "/piano/a.wav",
  //   117: "/piano/bb.wav",
  //   106: "/piano/b.wav",
  // }
  var defaults = {
    97: "/soundfiles/deep-techno-groove.wav",
    98: "/soundfiles/bam-bam-bolam.wav",
    99: "/soundfiles/nyan-cat.wav",
    100: "/soundfiles/day.wav",
    101: "/soundfiles/beads.wav",
    102: "/soundfiles/drums.wav",
    103: "/soundfiles/pew-pew.wav",
    104: "/soundfiles/grendel.wav",
    105: "/soundfiles/derp-yell.wav",
    106: "/soundfiles/belt-buckle.wav",
    107: "/soundfiles/oh-yeah.wav",
    108: "/soundfiles/power-up.wav",
    109: "/soundfiles/straight-techno-beat.wav",
    110: "/soundfiles/kame-hameha.wav",
    111: "/soundfiles/fart.wav",
    112: "/soundfiles/heavy-rain.wav",
    113: "/soundfiles/jet-whoosh.wav",
    114: "/soundfiles/mystery-chime.ogg",
    115: "/soundfiles/space-bloop.wav",
    116: "/soundfiles/techno-drums2.wav",
    117: "/soundfiles/whale.wav",
    118: "/soundfiles/vegeta-big-bang.wav",
    119: "/soundfiles/piano-mood.wav",
    120: "/soundfiles/boing-a.wav",
    121: "/soundfiles/techno-drums.wav",
    122: "/soundfiles/guitar-chord.wav"
  };
  res.send(defaults);
});

module.exports = app;
