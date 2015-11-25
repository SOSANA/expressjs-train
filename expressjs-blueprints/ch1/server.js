var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var User = require('./models/user');
var passport = require('./passport');
var config = require('./config')();

mongoose.connect(config.db_url, function(err) {
  if (err) throw err;
});

var app = express();

/**
 * In order to use passport, we have to enable a few things for our server.
 * First we need to enable cookies and session support. To enable session
 * support, we add a cookie parser. This middleware parses a cookie object into
 * 'req.cookies'. The session middleware lets us modify 'req.session' and have
 * that data persist across requests. By default, it uses cookies, but it has a
 * variety of session stores that you can configure. Then, we have to add
 * 'body-parsing' middleware, which parses the body of HTTP requests into a
 * JavaScript object 'req.body'. In our current case, we need this middleware to
 * extract the e-mail and password fields from POST requests. Finally, we add
 * the passport middleware and session support.
 */
app.use(express.static(__dirname + '/public'));
app.use(cookieParser('my dirty little secret'));
app.use(session({
  secret: "hello world",
  store: new MongoStore({
    url: config.sessionDb
  }),
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.exposeUser());

app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/views');

app.listen(process.env.PORT || 3000, function() {
  console.log('Express listening on port 3000');
});

module.exports.app = app;
var routes = require('./routes');
