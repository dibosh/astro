var express = require('express');
var router = express.Router();
var utils = require('../common/utils');

router.get('/', function (req, res) {
  _handleHttpRequestPromise(_makeChannelListResponse(req.query.pageSize, req.query.pageNumber), res);
});

router.get('/:channelId', function (req, res) {
  _handleHttpRequestPromise(_makeSingleChannelResponse(req.params.channelId), res);
});

function _handleHttpRequestPromise(httpPromise, res) {
  httpPromise
    .then(function (response) {
      res.status(response.status).send(response.body);
    })
    .catch(function (errorResponse) {
      var error = utils.getErrorInterpretation(errorResponse);
      res.status(error.statusCode).send(error.resolvedResponse);
    });
}

function _makeChannelListResponse(pageSize, pageNumber) {
  pageSize = pageSize || 10;
  var offset = (pageNumber || 1) - 1;
  var url = utils.prepareUrl('/ams/v3/getChannels');
  return utils.makeHttpRequest(null, url, null)
    .then(function (response) {
      var rawChannels = response.body.channel;
      var slice = rawChannels.slice(offset * pageSize, offset * pageSize + pageSize + 1);
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

function _makeSingleChannelResponse(channelId) {
  var url = utils.prepareUrl('/ams/v3/getChannels') + '?channelId=' + channelId;
  return utils.makeHttpRequest(null, url, null)
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
    setTopBoxNumber: channel.channelStbNumber,
    language: channel.channelLanguage,
    color: channel.channelColor1 || channel.channelColor2 || channel.channelColor3,
    logo: channel.channelExtRef[0].value
  };
}

module.exports = router;
