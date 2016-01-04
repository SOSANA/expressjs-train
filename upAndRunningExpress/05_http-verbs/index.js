var express = require('express');
var app = express();

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var engines = require('consolidate');

var bodyParser = require('body-parser');

function getUserFilePath(username) {
  return path.join(__dirname, 'users/', username) + '.json';
}

function getUser(username) {
  var user = JSON.parse(fs.readFileSync(getUserFilePath(username), {encoding: 'utf8'}));
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
  _.keys(user.location).forEach(function(key) {
    user.location[key] = _.startCase(user.location[key]);
  });

  return user;
}

function saveUser(username, data) {
  var fp = getUserFilePath(username);
  fs.unlinkSync(fp); // delete the file
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), {encoding: 'utf8'});
}

// setting engine to handlebars
app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');

// serving our static image directory
app.use('/profilepics', express.static('images'));
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/favicon.ico', function(req, res) {
  res.end();
});

// route to main page
app.get('/', function(req, res) {
  var users = [];
  fs.readdir('users', function(err, files) {
    files.forEach(function(file) {
      fs.readFile(path.join(__dirname, 'users', file), {encoding: 'utf8'}, function(err, data) {
        var user = JSON.parse(data);
        user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
        users.push(user);
        if (users.length === files.length) res.render('index', {users: users});
      });
    });
  });
});

// username route handler able to access username by passing params
app.get('/:username', function(req, res) {
  var username = req.params.username;
  var user = getUser(username);
  res.render('user', {
    user: username,
    address: user.location,
  });
});

app.put('/:username', function(req, res) {
  var username = req.params.username;
  var user = getUser(username);
  user.location = req.body;
  saveUser(username, user);
  res.end();
});

app.delete('/:username', function(req, res) {
  var fp = getUserFilePath(req.params.username);
  fs.unlinkSync(fp); // delete the file
  res.sendStatus(200);
});

var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port);
});
