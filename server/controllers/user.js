var express = require('express');
var router = express.Router();
var utils = require('../common/utils');
var authHelper = require('../middlewares/auth.helper');
var config = require('../common/config');
var jwt = require('jwt-simple');
var moment = require('moment');
var User = require('../models/user');
var _ = require('lodash');

router.put('/favoriteChannels', authHelper.ensureAuthenticated, function (req, res) {
  var promise = new Promise(function (resolve, reject) {
    if (_.isUndefined(req.body.channelIds)) {
      reject(utils.createErrorObject(500, 'channelIds must be provided.'));
    }

    var channelIds = req.body.channelIds.split(',');

    User.findById(req.user._id, function (err, foundUser) {
      if (err) {
        reject(utils.createErrorObject(500, err.message));
      }

      if (!foundUser) {
        reject(utils.createErrorObject(404, 'User not found.'));
      }

      foundUser.favoriteChannelIds = channelIds;
      foundUser.save(function (err, savedUser) {
        if (err) {
          reject(utils.createErrorObject(500, err.message));
        }

        resolve({
          status: 200,
          user: savedUser
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
  User.find({facebookProfileId: payload.sub}, function (err, user) {
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
