var express = require('express');
var app = express();

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var engines = require('consolidate');

// using to stream our JSON
var JSONStream = require('JSONStream');

// requiring bodyParser middleware to parse form information
var bodyParser = require('body-parser');

// setting up our view engine
app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');

// setting up our profile static files
app.use('/profilepics', express.static('images'));

// setting bodyParser urlencoded to true
app.use(bodyParser.urlencoded({ extended: true }));

// setting our favicon logo if one existed
app.get('/favicon.ico', function(req, res) {
  res.end();
});

// our main index route to get all users from database, parsing and uppercase
app.get('/', function(req, res) {
  var users = [];
  fs.readdir('users', function(err, files) {
    if (err) throw err;
    files.forEach(function(file) {
      fs.readFile(path.join(__dirname, 'users', file), { encoding: 'utf8' }, function(err, data) {
        if (err) throw err;
        var user = JSON.parse(data);
        user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
        users.push(user);
        if (users.length === files.length) res.render('index', { users: users });
      });
    });
  });
});

// defining a route that is a string pattern that will download a file of any
// route that ends in '.json' that is detected, we will trigger a download, and
// create a path to that corresponding json file by appending a path to the
// users directory
app.get('*.json', function(req, res) {
  res.download('./users/' + req.path, 'virus.json');
});

// useful for building api
app.get('/data/:username', function(req, res) {
  var username = req.params.username;

  // no longer blocks and pipes information to the brower
  var readable = fs.createReadStream('./users/' + username + '.json');
  readable.pipe(res);
});

// creating a dynamic, non blocking route for user genders that allows us to
// parse and send back data as we wish
app.get('/users/by/:gender', function(req, res) {
  var gender = req.params.gender;
  var readable = fs.createReadStream('users.json');

  readable
  .pipe(JSONStream.parse('*', function(user) { // asterix star means read everything
    if (user.gender === gender) return user.name; // getting back just name or use 'user' for all
  }))
  .pipe(JSONStream.stringify('[\n ', ',\n ', '\n]\n'))
  .pipe(res);
});

// display username error if not found
app.get('/error/:username', function(req, res) {
  res.status(404).send('No user named ' + req.params.username + ' found');
});

// requiring our username route handler
var userRouter = require('./username');
app.use('/:username', userRouter);

var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port);
});
