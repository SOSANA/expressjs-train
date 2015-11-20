/**
 * our model knows about the database, storage, and querying
 */

var mongoose = require('mongoose');
var validator = require('validator');
// our user schema model
var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});
// using mongoose middleware to rehash a user's password if and when they
// decide to change it, every time a user is saved, we'll check to server
// whether their password was changed
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  // If the user changed its password, we need to rehash
  this.password = User.encryptPassword(this.password);
  next();
});

// adding validation to make sure that our data is correct, using validator
// validator has validation based on length, URL, int, upper case, etc
// ***don't forget to validate all user input!!!***
// validation for email
User.schema.path('email').validate(function (email) {
  return validator.isEmail(email);
});

// validation for password
User.schema.path('password').validate(function (password) {
  return validator.isLength(password, 6);
});

var User = mongoose.model('User', userSchema);
module.exports = User;
