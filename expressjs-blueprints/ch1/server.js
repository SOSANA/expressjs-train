var express = require('express');
var app = express();

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
