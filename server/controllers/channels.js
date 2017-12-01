var express = require('express');
var router = express.Router();
var utils = require('../common/utils');
var events = require('./events');
var url = utils.prepareUrl('ams/v3/getChannels');

router.get('/', function (req, res) {
  utils.handleHttpRequestPromise(_makePaginatedChannelListResponse(req.query.pageSize, req.query.pageNumber), res);
});

router.get('/all', function (req, res) {
  utils.handleHttpRequestPromise(_makeChannelListResponse(), res);
});

router.get('/:channelId', function (req, res) {
  utils.handleHttpRequestPromise(_makeSingleChannelResponse(req.params.channelId), res);
});

router.use('/:channelId/events', events);

function _makePaginatedChannelListResponse(pageSize, pageNumber) {
  pageSize = parseInt(pageSize || 10);
  var offset = parseInt(pageNumber || 1) - 1;
  return utils.makeHttpRequest(null, url)
    .then(function (response) {
      var rawChannels = response.body.channel;
      var slice = rawChannels.slice(offset * pageSize, offset * pageSize + pageSize);
      var channelsResp = [];
      slice.forEach(function (channel) {
        channelsResp.push(createChannelResponse(channel));
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
  return utils.makeHttpRequest(null, url)
    .then(function (response) {
      var rawChannels = response.body.channel;
      var channelsResp = [];
      rawChannels.forEach(function (channel) {
        channelsResp.push(createChannelResponse(channel));
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
  return utils.makeHttpRequest(null, url, {channelId: channelId})
    .then(function (response) {
      return {
        status: response.body.responseCode,
        body: createChannelResponse(response.body.channel[0])
      };
    });
}

function createChannelResponse(channel) {
  return {
    title: channel.channelTitle,
    description: channel.channelDescription,
    category: channel.channelCategory,
    id: channel.channelId,
    isHD: channel.channelHD,
    setTopBoxNumber: channel.channelStbNumber,
    language: channel.channelLanguage,
    color: channel.channelColor1 || channel.channelColor2 || channel.channelColor3,
    logo: channel.channelExtRef[0].value
  };
}

module.exports = router;
