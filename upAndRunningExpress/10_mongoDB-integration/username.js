/**
 * putting our username route handlers into its own file for better code organization
 */
var express = require('express');
var helpers = require('./helpers');
var fs = require('fs');

// pulling in reference to the 'User' object aka model
var User = require('./db').User;

var router = express.Router({
  mergeParams: true,
});

// using the '.use' method instead of all and omit the '/' mount path
router.use(function(req, res, next) { // logging to console everytime a user is accessed
  console.log(req.method, 'for', req.params.username, ' at ' + req.path);
  next();
});

router.get('/', helpers.verifyUser, function(req, res) { // using our http get verb, verifying if user exists, and res with user info
  var username = req.params.username;
  User.findOne({ username: username }, function(err, user) {
    res.render('user', {
      user: user,
      address: user.location,
    });
  });
});

router.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

router.put('/', function(req, res) { // using our http put verb to update data info
  var username = req.params.username;
  User.findOneAndUpdate({ username: username }, { location: req.body }, function(err, user) {
    res.end();
    console.log(username + ' profile has been saved to the database!');
  });
});

router.delete('/', function(req, res) { // using our http delete verb to remove data
  var fp = helpers.getUserFilePath(req.params.username);
  fs.unlinkSync(fp); // delete the file
  res.sendStatus(200);
});

module.exports = router;
