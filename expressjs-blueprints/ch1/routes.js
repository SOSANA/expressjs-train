/**
 * extracting routes to own file
 *
 * we have a file dedicated to associating controller handlers with actual paths
 * that users can access. This is generally good practice because now we have a
 * place to come visit and see all of our defined routes. It also helps unclutter
 * our server.js file, which should be exclusively devoted to server configuration.
 */

var app = module.parent.exports.app;
var userRoutes = require('./controllers/user');
var passport = require('./passport');

app.get('/', function(req, res, next) {
  res.render('index');
});

app.post('/users/login', userRoutes.postLogin);
app.get('/users/register', userRoutes.showRegistrationForm);
app.post('/users/register', userRoutes.createUser);
app.get('/users/login', userRoutes.showLoginForm);
app.post('/users/login', userRoutes.createSession);
app.get('/users/:id', userRoutes.getProfile);
