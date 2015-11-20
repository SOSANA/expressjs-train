/**
 *	- Before we can make full use of passport, we need to tell it how to do a few
 * 		important things.
 * 	- First, we need to instruct passport how to serialize a user to a session.
 *  - Then, we need to deserialize the user from the session information.
 *  - Finally, we need to tell passport how to tell if a given e-mail/password
 *  	combination represents a valid user as given below
 *
 * 	- This is used in passport's middleware, after the request is finished, we
 * 		take req.user and serialize their ID to our persistent session. When we
 * 		first get a request, we take the ID stored in our session, retrieve the
 * 		record from the database, and populate the request object with a user
 * 		property. All of this functionality is provided transparently by passport,
 * 		as long as we provide definitions for these two functions as given in the following:
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('mongoose').model('User');
// tell passport that when we serialize a user, we only need that user's id
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
// when we want to deserialize a user from a session data, we just look up a
// user by their id
passport.deserializeUser(function (id, done) {
  User.findById(id, done);
});

/**
 * This is used in passport's middleware, after the request is finished, we
 * take req.user and serialize their ID to our persistent session. When we first
 * get a request, we take the ID stored in our session, retrieve the record from
 * the database, and populate the request object with a user property. All of
 * this functionality is provided transparently by passport, as long as we provide
 * definitions for these two functions as given in the following:
 */
function authFail(done) {
  done(null, false, { message: 'incorrect email/password combination'});
}
/**
 * We tell passport how to authenticate a user locally. We create a new
 * LocalStrategy() function, which, when given an e-mail and password, will try
 * to lookup a user by e-mail field to be unique, so there should only be one
 * user. If there is no user, we return an error. If there is a user, but they
 * provided an invalid password, we still return an error. If there is a user
 * and they provided the correct password, then we tell passport that the
 * authentication request was a success by calling the done callback with the
 * valid user.
 */
passport.use(new LocalStrategy(function (email, password, done) {
  User.findOne({
    email: email
  }, function (err, user) {
    if (err) return done(err);
    if (!user) {
      return authFail(done);
    }
    if (!user.validPassword(password)) {
      return authFail(done);
    }
    return done(null, user);
  });
}));
