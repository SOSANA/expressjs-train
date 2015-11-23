var config = {
  development: {
    db_url: 'mongodb://localhost/chapter01',
    sessionDb: 'mongodb://localhost/chapter01_sessions',
    domain: 'localhost'
  },
  test: {
    db_url: 'mongodb://localhost/chapter01_test',
    sessionDb: 'mongodb://localhost/chapter01_sessions_test',
    domain: 'localhost'
  },
  production: {
    db_url: process.env.MONGOLAB_URI,
    sessionDb: process.env.MONGOLAB_URI,
    domain: 'baugarten-chapter01.herokuapp.com'
  }
};

var common = {
  twitter: {
    consumerKey: process.env.TWITTER_KEY || 'dVy25XkvTOy48VFj6K98vUavs',
    consumerSecret: process.env.TWITTER_SECRET  || 'Uaz3wQYFp2ijHTFlhlhsf0taPI0scuszqvcKjcH1kC2ZJ5ARt9',
    callbackURL: '/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '163767935869-achsp47ok2u6ov9piefmj346n5mbl66k.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || '-IOSsOHC46xvjjmghToOWprn',
    callbackURL: '/auth/google/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || '7722ce2ca84309eea4c0',
    clientSecret: process.env.GITHUB_SECRET || 'b4b654264c53c2ae1807e1919c2a3387173f36d9',
    callbackURL: '/auth/github/callback'
  }
};

// For all environments, add common properties
for (var commonkey in common) {
  for (var key in config) {
    config[key][commonkey] = common[commonkey];
  }
}

module.exports = function() {
  return config[process.env.NODE_ENV || 'development'];
};
