/**
 * This file is the entry point for our application. It is here that we generate
 * an application, register routes, and finally listen for incoming requests on
 * port 3000 . The require('express') method returns a generator of applications
 */
var express = require('express');
var app = express();

// setting the default view engine for express
// using ejs render for .html extensions
// specifying the folder that express should look into for view files
// This is useful if you choose one templating option and later want to switch
// to a new one in an incremental way
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.engine('html', require('ejs').__express);

app.set('views', __dirname + '/views');

app.get('/', function (req, res, next) {
  res.render('index');
});
app.listen(3000, function () {
  console.log("app listening on 3000");
});
