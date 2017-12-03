var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var router = express.Router({mergeParams: true});
var utils = require('../common/utils');
var cache = require('../middlewares/cache');
var eventsUrl = utils.prepareEventsUrl(utils.configVersion);
var Channel = require('../models/channel');

// safe to cache 1 hour of upcoming events for specific request
router.use(cache(60));

router.get('/', function (req, res) {
  utils.handleHttpRequestPromise(_makeEventListResponse(req.query), res);
});

router.get('/all', function (req, res) {
  var query = req.query;

  var dateFormat = 'YYYY-MM-DD HH:mm';
  var onlyDayFormat = 'YYYY-MM-DD';
  var startDate = moment(query.startDate, dateFormat);
  var startDay = startDate.format(onlyDayFormat);
  var endDate = moment(query.endDate, dateFormat);
  var endDay = endDate.format(onlyDayFormat);
  if (startDay !== endDay) {
    res.status(400).send({
      message: 'For `/all` endpoint to work; endDate, startDate must be within the same day. ' +
      'Example: startDate: 2017-12-03 12:50, endDate: 2017-12-03 23:59'
    });
  }

  var hoursDifference = Math.ceil(moment.duration(endDate.diff(startDate)).asHours());
  if (hoursDifference > 6) {
    res.status(400).send({
      message: 'For `/all` endpoint diff(endDate, startDate) must be 6hours or less.'
    });
  }

  Channel.find(function (err, channels) {
    if (err) {
      throw err;
    }
    var channelIds = _(channels).sortBy('channelId').pluck('channelId').value().join();
    query = _.extend(query, {channelIds: channelIds});
    utils.handleHttpRequestPromise(_makeEventListResponse(query), res);
  });
});

function _makeEventListResponse(query) {
  if (!query || !query.channelIds || !query.startDate || !query.endDate) {
    return new Promise(function (resolve) {
      resolve({
        status: 400,
        body: {
          message: 'channelIds, startDate, endDate are mandatory query params.'
        }
      });
    });
  }
  var requestConfig = {
    channelId: query.channelIds,
    periodStart: query.startDate,
    periodEnd: query.endDate
  };

  return utils.makeHttpRequest(null, eventsUrl, requestConfig)
    .then(function (response) {
      var rawEvents = response.body.getevent;
      var eventsResp = [];
      rawEvents.forEach(function (event) {
        eventsResp.push(utils.createEventResponse(event));
      });

      return {
        status: response.body.responseCode,
        body: {
          numFound: rawEvents.length,
          events: eventsResp
        }
      };
    });
}

module.exports = router;
