/**
 * putting our username route handlers into its own file for better code organization
 */
var express = require('express');
var helpers = require('./helpers');
var fs = require('fs');

var router = express.Router({
  mergeParams: true,
});

// when handling multple routes with the same route name ex '/:username', one
// way to handle this is to use app.route and chain methods http methods
// notice we don't have to specify our route or app.get/all/put/delete etc
router.all('/', function(req, res, next) { // logging to console everytime a user is accessed
  console.log(req.method, 'for', req.params.username);
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
