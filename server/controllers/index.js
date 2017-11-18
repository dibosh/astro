var express = require('express');
var router = express.Router();

router.use('/channels', require('./channels.js'));

module.exports = router;
