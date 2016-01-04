/**
 * putting our username route handlers into its own file for better code organization
 */
var express = require('express');
var helpers = require('./helpers');
var fs = require('fs');

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
  var user = helpers.getUser(username);
  res.render('user', {
    user: user,
    address: user.location,
  });
});

router.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// shows how using sub paths makes things easy, look at user.hbs href edit
router.get('/edit', function(req, res) {
  res.send('You want to edit ' + req.params.username + '???');
});

router.put('/', function(req, res) { // using our http put verb to update data info
  var username = req.params.username;
  var user = helpers.getUser(username);
  user.location = req.body;
  helpers.saveUser(username, user);
  res.end();
});

router.delete('/', function(req, res) { // using our http delete verb to remove data
  var fp = helpers.getUserFilePath(req.params.username);
  fs.unlinkSync(fp); // delete the file
  res.sendStatus(200);
});

module.exports = router;
