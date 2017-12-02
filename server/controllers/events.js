var express = require('express');
var router = express.Router({mergeParams: true});
var utils = require('../common/utils');
var eventsUrl = utils.prepareEventsUrl(utils.configVersion);

router.get('/', function (req, res) {
  utils.handleHttpRequestPromise(_makeEventListResponse(req.query), res);
});

router.get('/forChannelCategory', function (req, res) {
  utils.handleHttpRequestPromise(_makeEventListResponseBasedOnChannelCategory(req.query), res);
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

function _makeEventListResponseBasedOnChannelCategory(query) {
  if (!query || !query.channelCategory || !query.startDate || !query.endDate) {
    return new Promise(function (resolve) {
      resolve({
        status: 400,
        body: {
          message: 'channelCategory, startDate, endDate are mandatory query params.'
        }
      });
    });
  }
  var requestConfig = {
    channelCategory: query.channelCategory,
    periodStart: query.startDate,
    periodEnd: query.endDate,
    live: false,
    highlight: false
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
