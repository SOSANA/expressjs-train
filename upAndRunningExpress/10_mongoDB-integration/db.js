/**
 * imported user_list.json into mongodb
 * 	- $ mongoimport --db test --collection users --drop --file user_list.json
 */
var url = 'mongodb://localhost:27017/test';

var mongoose = require('mongoose');
mongoose.connect(url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log('db connected');
});

var userSchema = mongoose.Schema({
  username: String,
  gender: String,
  name: {
    title: String,
    first: String,
    last: String,
    full: String,
  },
  location: {
    street: String,
    city: String,
    state: String,
    zip: Number,
  },
});

// exporting object called 'User', passed in the name of the model 'User' and
// the schema we just defined above
exports.User = mongoose.model('User', userSchema);

/*
exports.User.find({}, function(err, users) {
  console.log(users);
});
*/
