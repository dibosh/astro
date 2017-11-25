var express = require('express');
var router = express.Router();
var utils = require('../common/utils');

router.get('/', function (req, res) {
  var pageSize = req.query.pageSize || 10;
  var offset = (req.query.pageNumber || 1) - 1;
  utils.makeHttpRequest(null, utils.prepareChannelsUrl(), null)
    .then(function (response) {
      var rawChannels = response.body.channel;
      var slice = rawChannels.slice(offset * pageSize, offset * pageSize + pageSize + 1);
      var channelsResp = [];
      slice.forEach(function(channel){
        channelsResp.push(createChannelResponse(channel));
      });
      res.status(response.body.responseCode).send({
        numFound: rawChannels.length,
        pageSize: pageSize,
        pageNumber: offset + 1,
        channels: channelsResp,
        next: '/channels?pageNumber=' + (offset + 2) + '&pageSize=' + pageSize
      });
    })
    .catch(function (errorResponse) {
      var error = utils.getErrorInterpretation(errorResponse);
      res.status(error.statusCode).send(error.resolvedResponse);
    });
});

function createChannelResponse(channel) {
  return {
    title: channel.channelTitle,
    description: channel.channelDescription,
    category: channel.channelCategory,
    number: channel.channelStbNumber,
    setTopBoxNumber: channel.channelStbNumber,
    language: channel.channelLanguage,
    color: channel.channelColor1 || channel.channelColor2 || channel.channelColor3,
    logo: channel.channelExtRef[0].value
  };
}

module.exports = router;
