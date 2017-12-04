var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var router = express.Router({mergeParams: true});
var utils = require('../common/utils');
var eventsUrl = utils.prepareEventsUrl(utils.configVersion);
var Channel = require('../models/channel');

router.get('/', function (req, res) {
  utils.handleHttpRequestPromise(_makeEventListResponse(req.query), res);
});

router.get('/all', function (req, res) {
  var query = req.query;
  var dateFormat = 'YYYY-MM-DD HH:mm';
  var startDate = moment(query.startDate, dateFormat);
  var endDate = moment(query.endDate, dateFormat);

  var errPromise = _isDateRangeGivenPromise(query)
    || _isDateRangeWithinSameDayPromise(startDate, endDate)
    || _isDateRangeWithinLimitPromise(startDate, endDate);

  if (errPromise) {
    utils.handleHttpRequestPromise(errPromise, res);
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

function _isDateRangeWithinSameDayPromise(startDate, endDate) {
  var errPromise;
  var onlyDayFormat = 'YYYY-MM-DD';
  var startDay = startDate.format(onlyDayFormat);
  var endDay = endDate.format(onlyDayFormat);

  if (startDay !== endDay) {
    errPromise = new Promise(function (resolve, reject) {
      reject(utils.createErrorObject(400, 'For `/all` endpoint to work; endDate, startDate must be within the same day. ' +
          'Example: startDate: 2017-12-03 12:50, endDate: 2017-12-03 23:59'));
    });
  }

  return errPromise;
}

function _isDateRangeWithinLimitPromise(startDate, endDate) {
  var errPromise;
  var hoursDifference = Math.ceil(moment.duration(endDate.diff(startDate)).asHours());
  if (hoursDifference > 6) {
    errPromise = new Promise(function (resolve, reject) {
      reject(utils.createErrorObject(400, 'For `/all` endpoint diff(endDate, startDate) must be 6hours or less.'));
    });
  }

  return errPromise;
}

function _isDateRangeGivenPromise(query) {
  var errPromise;

  if(_.isEmpty(query) || !query.startDate || !query.endDate) {
    errPromise = new Promise(function (resolve, reject) {
      reject(utils.createErrorObject(400, 'startDate, endDate are mandatory query params.'));
    });
  }
  return errPromise;
}

function _isChannelIdsGivenPromise(query) {
  var errPromise;

  if(_.isEmpty(query) || !query.channelIds) {
    errPromise = new Promise(function (resolve, reject) {
      reject(utils.createErrorObject(400, 'channelIds must be given.'));
    });
  }
  return errPromise;
}

function _makeEventListResponse(query) {
  var errPromise = _isChannelIdsGivenPromise(query) || _isDateRangeGivenPromise(query);
  if (errPromise) {
    return errPromise;
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
