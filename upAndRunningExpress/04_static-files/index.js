var express = require('express');
var app = express();

var fs = require('fs');
var _ = require('lodash');
var engines = require('consolidate');

var users = [];

fs.readFile('users.json', {encoding: 'utf8'}, function(err, data) {
  if (err) throw err;

  JSON.parse(data).forEach(function(user) {
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
    users.push(user);
  });
});

// setting engine to handlebars
app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');

// servering our static image directory
app.use('/profilepics', express.static('images'));

// route to main page
app.get('/', function(req, res) {
  res.render('index', { users: users });
});

// note that this has to be before the username params as it gets called once
// use reg exp as the first argument to search for any strings that start with
// big and any other characters, and log out to console
app.get(/big.*/, function(req, res, next) {
  console.log('BIG USER ACCESS');
  next();
});

app.get(/.*dog.*/, function(req, res, next) {
  console.log('DOGS GO WOOF WOOF');
  next();
});

// username route handler able to access username by passing params
app.get('/:username', function(req, res) {
  var username = req.params.username;
  res.render('user', { username: username });
});

var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port);
});
