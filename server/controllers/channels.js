var express = require('express');
var router = express.Router();
var utils = require('../common/utils');
var moment = require('moment');
var eventsUrl = utils.prepareEventsUrl(utils.configVersion);
var channelsUrl = utils.prepareChannelsUrl(utils.configVersion);

router.get('/', function (req, res) {
  utils.handleHttpRequestPromise(_makePaginatedChannelListResponse(req.query.pageSize, req.query.pageNumber), res);
});

router.get('/all', function (req, res) {
  utils.handleHttpRequestPromise(_makeChannelListResponse(), res);
});

router.get('/:channelId', function (req, res) {
  utils.handleHttpRequestPromise(_makeSingleChannelResponse(req.params.channelId), res);
});

router.get('/:channelId/events', function (req, res) {
  utils.handleHttpRequestPromise(_makeEventListResponse(req.params.channelId, req.query.startTime), res);
});

function _makePaginatedChannelListResponse(pageSize, pageNumber) {
  pageSize = parseInt(pageSize || 10);
  var offset = parseInt(pageNumber || 1) - 1;
  return utils.makeHttpRequest(null, channelsUrl)
    .then(function (response) {
      var rawChannels = response.body.channel;
      var slice = rawChannels.slice(offset * pageSize, offset * pageSize + pageSize);
      var channelsResp = [];
      slice.forEach(function (channel) {
        channelsResp.push(utils.createChannelResponse(channel));
      });

      return {
        status: response.body.responseCode,
        body: {
          numFound: rawChannels.length,
          pageSize: pageSize,
          pageNumber: offset + 1,
          channels: channelsResp,
          next: '/channels?pageNumber=' + (offset + 2) + '&pageSize=' + pageSize
        }
      };
    });
}

function _makeChannelListResponse() {
  return utils.makeHttpRequest(null, channelsUrl)
    .then(function (response) {
      var rawChannels = response.body.channel;
      var channelsResp = [];
      rawChannels.forEach(function (channel) {
        channelsResp.push(utils.createChannelResponse(channel));
      });

      return {
        status: response.body.responseCode,
        body: {
          numFound: rawChannels.length,
          channels: channelsResp
        }
      };
    });
}

function _makeSingleChannelResponse(channelId) {
  return utils.makeHttpRequest(null, channelsUrl, {channelId: channelId})
    .then(function (response) {
      return {
        status: response.body.responseCode,
        body: utils.createChannelResponse(response.body.channel[0])
      };
    });
}

function _makeEventListResponse(channelId, startTime) {
  var onlyDate = moment(startTime).format('YYYY-MM-DD');
  var startTimeStr = moment(startTime).format('YYYY-MM-DD HH:mm');
  var endTimeStr = onlyDate + ' 23:59';
  return utils.makeHttpRequest(null, eventsUrl, {
      channelId: channelId,
      periodStart: startTimeStr,
      periodEnd: endTimeStr
    })
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
