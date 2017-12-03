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

router.get('/:channelId/events', function (req, res) {
  utils.handleHttpRequestPromise(_makeEventListResponse(req.params.channelId, req.query.startTime), res);
});

router.put('/markAsFavorite/:consent', function (req, res) {
  var channelIds = req.body.channelIds.split(',');
  var isFavorite = req.params.consent === 'yes';
  var promise = _markChannelsAsFavorite(channelIds, isFavorite)
    .then(function () {
      return {
        status: 200,
        body: {
          message: 'Channels with specified ids were updated successfully.'
        }
      };
    });
  utils.handleHttpRequestPromise(promise, res);
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
  if (_.isEmpty(utils.globalSettings) || !utils.globalSettings.isChannelsCached) {
    return utils.makeHttpRequest(null, channelsUrl)
      .then(function (response) {
        return _cacheChannels(response.body.channel);
      });
  } else {
    return Channel.find().exec();
  }
}

function _cacheChannels(rawChannels) {
  return new Promise(function (resolve, reject) {
    var channels = [];
    _.each(rawChannels, function (channel, index) {
      var channelModel = utils.createChannelInstanceFromRaw(channel);
      channelModel.save(function (err, savedChannel) {
        if (err) {
          reject(utils.createErrorObject(500, err.message));
        }

        channels.push(savedChannel);
        if (index === rawChannels.length - 1) {
          utils.updateGlobalSettings({isChannelsCached: true});
          resolve(channels);
        }
      });
    });
  });
}

function _markChannelsAsFavorite(channelIds, isFavorite) {
  return Channel.find()
    .where('channelId')
    .in(channelIds)
    .exec()
    .then(function (channels) {
      _.each(channels, function (channel) {
        channel.isFavorite = isFavorite;
        channel.save(function (err) {
          if (err) {
            throw err;
          }
        });
      });
    });
}

module.exports = router;
