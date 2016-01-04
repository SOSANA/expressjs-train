var express = require('express');
var app = express();

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var engines = require('consolidate');

// requiring bodyParser middleware to parse form information
var bodyParser = require('body-parser');

// get username, parse that info, uppercase first and last name, and location
function getUser(username) {
  var user = JSON.parse(fs.readFileSync(getUserFilePath(username), { encoding: 'utf8' }));
  user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
  _.keys(user.location).forEach(function(key) {
    user.location[key] = _.startCase(user.location[key]);
  });

  return user;
}

// path to our user data
function getUserFilePath(username) {
  return path.join(__dirname, 'users', username) + '.json';
}

// save our user info
function saveUser(username, data) {
  var fp = getUserFilePath(username);
  fs.unlinkSync(fp); // delete the file
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), { encoding: 'utf8' });
}

// verify if user exists
function verifyUser(req, res, next) {
  var fp = getUserFilePath(req.params.username);

  fs.exists(fp, function(yes) {
    if (yes) {
      next();
    } else {
      res.redirect('/error/' + req.params.username);
    }
  });
}

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
    files.forEach(function(file) {
      fs.readFile(path.join(__dirname, 'users', file), { encoding: 'utf8' }, function(err, data) {
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
  var user = getUser(username);
  res.json(user);
});

// display username error if not found
app.get('/error/:username', function(req, res) {
  res.status(404).send('No user named ' + req.params.username + ' found');
});

// logging to console everytime a user is accessed
app.all('/:username', function(req, res, next) {
  console.log(req.method, 'for', req.params.username);
  next();
});

// using our http get verb, verifying if user exists, and res with user info
app.get('/:username', verifyUser, function(req, res) {
  var username = req.params.username;
  var user = getUser(username);
  res.render('user', {
    user: user,
    address: user.location,
  });
});

// using our http put verb to update data info
app.put('/:username', function(req, res) {
  var username = req.params.username;
  var user = getUser(username);
  user.location = req.body;
  saveUser(username, user);
  res.end();
});

// using our http delete verb to remove data
app.delete('/:username', function(req, res) {
  var fp = getUserFilePath(req.params.username);
  fs.unlinkSync(fp); // delete the file
  res.sendStatus(200);
});

var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port);
});
