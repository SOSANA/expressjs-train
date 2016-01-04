/**
 * putting our helper functions in a utility file for better code organization
 */
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

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

exports.getUser = getUser;
exports.getUserFilePath = getUserFilePath;
exports.saveUser = saveUser;
exports.verifyUser = verifyUser;
