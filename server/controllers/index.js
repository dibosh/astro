var express = require('express');
var router = express.Router();

router.use('/channels', require('./channels.js'));
router.use('/events', require('./events.js'));
router.use('/user', require('./user.js'));

module.exports = router;
