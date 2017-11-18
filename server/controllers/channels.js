var express = require('express');
var router = express.Router();
var request = require('request-promise');
var API_URL = 'http://ams-api.astro.com.my/';

router.use(function timeLog(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

function getErrorInterpretation(errorObject) {
  if (errorObject.hasOwnProperty('statusCode') && errorObject.hasOwnProperty('error')) {
    // custom error object from request lib
    return {
      statusCode: errorObject.statusCode,
      resolvedResponse: errorObject.error.error
    };
  } else {
    return {
      statusCode: 500,
      resolvedResponse: {
        message: errorObject.message
      }
    }
  }
}

router.get('/', function (req, res) {
  var pageSize = req.query.pageSize || 10;
  var offset = (req.query.pageNumber || 1) - 1;
  var requestConfig = prepareRequestConfig(null, prepareUrl('/ams/v3/getChannels'), null);
  request(requestConfig)
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
      var error = getErrorInterpretation(errorResponse);
      res.status(error.statusCode).send(error.resolvedResponse);
    });
});

function prepareRequestConfig(method, url, headers) {
  return {
    method: method || 'GET',
    url: url,
    json: true,
    resolveWithFullResponse: true,
    headers: headers || {
      'User-Agent': 'dibosh'
    }
  };
}

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

function prepareUrl(path) {
  return API_URL + path;
}

module.exports = router;
