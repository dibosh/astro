var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../common/config');
var User = require('../models/user');
var authHelper = {};

authHelper.ensureAuthenticated = function (req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(401).send({message: 'Please make sure your request has an Authorization header'});
  }
  var token = req.header('Authorization').split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({message: err.message});
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({message: 'Token has expired.'});
  }

  User.findOne({facebookProfileId: payload.sub}, function (err, user) {
    if (!user) {
      return res.status(404).send({message: 'User not found.'});
    }

    if (err) {
      res.status(500).send(err);
    }

    req.user = user;
    next();
  });
};

authHelper.createJWT = function (user) {
  var payload = {
    sub: user.facebookProfileId,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};

module.exports = authHelper;
