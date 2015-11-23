/**
 * Our user controller will have all the routes that manipulate the user model.
 * Routes in our server.js file is generally bad practice. What we want to do is
 * have separate controllers for each kind of route that we want.
 *
 * Note that the User model takes care of the validations and registration logic;
 * we just provide callback. Doing this helps consolidate the error handling and
 * generally makes the registration logic easier to understand. If the registration
 * was successful, we call req.login , a function added by passport, which creates
 * a new session for that user and that user will be available as req.user on
 * subsequent requests.
 */
var passport = require('../passport');
var User = require('mongoose').model('User');

module.exports.getLogin = function(req, res, next) {
  res.render('login');
};

// this tells passport that the handler uses the local authentication Strategy
// so when someone hits the route, passport will delegate to our LocalStrategy
// if they provided a valid email/password combination, our LocalStrategy will
// give passport the now authenticated user, and passport will redirect the User
// to the server root. if the email/password combination was unsuccessful,
// passport will redirect the user to /login so they can try again
module.exports.postLogin = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
});

module.exports.getRegister = function(req, res, next) {
  res.render('register');
};

module.exports.postRegister = function(req, res, next) {
  User.register(req.body.email, req.body.password, function(err, user) {
    if (err) return next(err);
    req.login(user, function(err) {
      if (err) return next(err);
      res.redirect('/');
    });
  });
};

module.exports.getProfile = function(req, res, next) {
  res.render('users/profile', { user: req.user.toJSON() });
};

module.exports.logout = function(req, res, next) {
  req.logout();
  res.redirect('/');
};
