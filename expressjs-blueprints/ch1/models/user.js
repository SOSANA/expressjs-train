/**
 * our model knows about the database, storage, and querying
 */
 var mongoose = require('mongoose');
 var bcrypt = require('bcrypt');
 var validator = require('validator');
// our user schema model
var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  twitter: String,
  google: String,
  github: String,
  tokens: Array,
  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
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

userSchema.methods = {
  validPassword: function(password) {
    return bcrypt.compareSync(password, this.password);
  }
};

userSchema.statics = {
  makeSalt: function() {
    return bcrypt.genSaltSync(10);
  },
  encryptPassword: function(password) {
    if (!password) {
      return '';
    }
    return bcrypt.hashSync(password, User.makeSalt());
  },
  register: function(email, password, cb) {
    var user = new User({
      email: email,
      password: password
    });
    user.save(function(err) {
      cb(err, user);
    });
  }
};

var User = mongoose.model('User', userSchema);
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

module.exports = User;
