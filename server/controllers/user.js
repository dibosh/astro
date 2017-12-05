var express = require('express');
var router = express.Router();
var config = require('../common/config');
var jwt = require('jwt-simple');
var moment = require('moment');
var User = require('../models/user');

router.get('/me', function (req, res) {
  var token = req.header('Authorization').split(' ')[1];
  var payload = jwt.decode(token, config.TOKEN_SECRET);
  User.findById(payload.sub, function (err, user) {
    if (!user) {
      return res.status(400).send({message: 'User not found'});
    }

    if (err) {
      return res.status(500).send({message: err.message});
    }
    return res.status(200).send(user);
  });
});

module.exports = router;
