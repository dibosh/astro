var express = require('express');
var router = express.Router();

router.use('/channels', require('./channels.js'));
router.use('/events', require('./events.js'));

module.exports = router;
