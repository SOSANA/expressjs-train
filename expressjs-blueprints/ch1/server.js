/**
 * Notes Go Here
 */
var express = require('express');
var app = express();

app.get('/', function (req, res, next) {
  res.send('hello world');
});
app.listen(3000, function () {
  console.log("app listening on 3000");
});