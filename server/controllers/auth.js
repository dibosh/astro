var authHelper = require('../middlewares/auth.helper');
var express = require('express');
var router = express.Router();
var utils = require('../common/utils');
var config = require('../common/config');
var jwt = require('jwt-simple');
var moment = require('moment');
var User = require('../models/user');

router.post('/facebook', function (req, res) {
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');

  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  var redirectRequest = {
    do: _fetchProfile,
    url: graphApiUrl
  };

  function successCallback(data) {
    return res.status(200).send(data);
  }

  function failureCallback(status, error) {
    return res.status(status).send(error);
  }

  _fetchAccessToken(accessTokenUrl, params, redirectRequest, successCallback, failureCallback);
});

function _fetchAccessToken(url, params, redirectRequest, successCallback, failureCallback) {
  utils.makeHttpRequestWithCallback(null, url, params, null, null, function (err, response, accessToken) {
    if (response.statusCode !== 200) {
      return failureCallback(500, {message: accessToken.error.message});
    }

    redirectRequest.do(redirectRequest.url, accessToken, successCallback, failureCallback);
  });
}

function _fetchProfile(url, params, successCallback, failureCallback) {
  utils.makeHttpRequestWithCallback(null, url, params, null, null, function (err, response, profile) {
    if (response.statusCode !== 200) {
      return failureCallback(500, {message: profile.error.message});
    }

    User.findOne({facebookProfileId: profile.id}, function (err, existingUser) {
      if (existingUser) {
        return failureCallback(409, {message: 'There is already a Facebook account that belongs to you'});
      }

      if (err) {
        return failureCallback(500, {message: err.message});
      }

      var user = new User();
      user.facebookProfileId = profile.id;
      user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
      user.displayName = profile.name;
      user.save(function (err, savedUser) {
        if (err) {
          return failureCallback(500, {message: err.message});
        }
        var token = authHelper.createJWT(savedUser);
        console.log(token);
        successCallback({token: token, user: savedUser});
      });
    });
  });
}

module.exports = router;
