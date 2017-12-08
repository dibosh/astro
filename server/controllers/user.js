var express = require('express');
var router = express.Router();
var utils = require('../common/utils');
var authHelper = require('../middlewares/auth.helper');
var config = require('../common/config');
var jwt = require('jwt-simple');
var moment = require('moment');
var User = require('../models/user');
var _ = require('lodash');

router.put('/me', authHelper.ensureAuthenticated, function (req, res) {
  var promise = new Promise(function (resolve, reject) {
    if (_.isUndefined(req.body)) {
      reject(utils.createErrorObject(500, 'Nothing to update.'));
    }

    User.findOne({facebookProfileId: req.user.facebookProfileId}, function (err, foundUser) {
      if (err) {
        reject(utils.createErrorObject(500, err.message));
      }

      if (!foundUser) {
        reject(utils.createErrorObject(404, 'User not found.'));
      }

      foundUser.favoriteChannelIds = req.body.favoriteChannelIds;
      foundUser.save(function (err, savedUser) {
        if (err) {
          reject(utils.createErrorObject(500, err.message));
        }

        resolve({
          status: 200,
          body: savedUser
        });
      });
    });
  });

  utils.handleHttpRequestPromise(promise, res);
});

router.get('/me', function (req, res) {
  if (_.isEmpty(req.header('Authorization'))) {
    return respond(res, 400, {message: 'Auth token must be passed in headers.'});
  }

  var token = req.header('Authorization').split(' ')[1];
  var payload = jwt.decode(token, config.TOKEN_SECRET);
  User.findOne({facebookProfileId: payload.sub}, function (err, user) {
    if (!user) {
      return respond(res, 404, {message: 'User not found.'});
    }

    if (err) {
      return respond(res, 500, err);
    }

    return respond(res, 200, null, user);
  });
});

function respond(res, status, err, user) {
  if (err) {
    return res.status(status).send({status: status, error: err.message});
  }
  if (user) {
    return res.status(status).send({status: status, user: user});
  }
}

module.exports = router;
