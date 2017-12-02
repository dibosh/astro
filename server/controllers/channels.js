var express = require('express');
var router = express.Router();
var utils = require('../common/utils');
var moment = require('moment');
var _ = require('lodash');
var eventsUrl = utils.prepareEventsUrl(utils.configVersion);
var channelsUrl = utils.prepareChannelsUrl(utils.configVersion);
var Channel = require('../models/channel');

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

  return _prepareChannelCache()
    .then(function (channels) {
      var slice = channels.slice(offset * pageSize, offset * pageSize + pageSize);
      return {
        status: 200,
        body: {
          numFound: channels.length,
          pageSize: pageSize,
          pageNumber: offset + 1,
          channels: slice,
          next: '/channels?pageNumber=' + (offset + 2) + '&pageSize=' + pageSize
        }
      };
    });
}

function _makeChannelListResponse() {
  return _prepareChannelCache()
    .then(function (channels) {
      return {
        status: 200,
        body: {
          numFound: channels.length,
          channels: channels
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

function _prepareChannelCache() {
  var promise;
  if (!_.get(utils.globalSettings, 'isChannelsCached')) {
    promise = utils.makeHttpRequest(null, channelsUrl)
      .then(function (response) {
        var rawChannels = response.body.channel;
        var channels = [];
        rawChannels.forEach(function (channel) {
          var channel = utils.createChannelInstanceFromRaw(channel);
          channel.save(function (err) {
            if (err) {
              throw err;
            }

            channels.push(channel);
          });
        });

        return channels;
      });
  } else {
    promise = Channel.find().exec();
  }

  return promise;
}

module.exports = router;
