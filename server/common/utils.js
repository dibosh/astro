var request = require('request-promise');
var _ = require('lodash');
var utils = {};
utils.configVersion = '';

utils.getErrorInterpretation = function (errorObject) {
  if (errorObject.hasOwnProperty('statusCode') && errorObject.hasOwnProperty('error')) {
    // custom error object from request lib
    return {
      statusCode: _.get(errorObject, 'statusCode'),
      resolvedResponse: _.get(errorObject, 'error.error')
    };
  } else {
    return {
      statusCode: 500,
      resolvedResponse: {
        message: _.get(errorObject, 'message')
      }
    }
  }
};

utils.prepareUrl = function (path, configVersion) {
  configVersion = configVersion || '';
  var API_URL = require('./config' + configVersion).API_URL;
  return API_URL + path;
};

utils.prepareChannelsUrl = function (configVersion) {
  configVersion = configVersion || '';
  var channelsEndpoint = require('./config' + configVersion).CHANNELS_ENDPOINT;
  return utils.prepareUrl(channelsEndpoint, configVersion);
};

utils.prepareEventsUrl = function (configVersion) {
  configVersion = configVersion || '';
  var eventsEndpoint = require('./config' + configVersion).EVENTS_ENDPOINT;
  return utils.prepareUrl(eventsEndpoint, configVersion);
};

utils.prepareEventsRequestConfig = function (channelIds, start, end, configVersion) {
  configVersion = configVersion || '';
  var requestConfig = {};
  requestConfig[configVersion === 'v2' ? 'channelIds' : 'channelId'] = channelIds;
  requestConfig[configVersion === 'v2' ? 'startdate' : 'periodStart'] = start;
  requestConfig[configVersion === 'v2' ? 'enddate' : 'periodEnd'] = end;
  return requestConfig;
};


utils.makeHttpRequest = function (method, url, params, data, headers) {
  var requestConfig = _prepareHttpRequestConfig(method, url, params, data, headers);
  return request(requestConfig);
};

utils.handleHttpRequestPromise = function (httpPromise, res) {
  httpPromise
    .then(function (response) {
      res.status(response.status).send(response.body);
    })
    .catch(function (errorResponse) {
      var error = utils.getErrorInterpretation(errorResponse);
      res.status(error.statusCode).send(error.resolvedResponse);
    });
};

function _prepareHttpRequestConfig(method, url, params, data, headers) {
  var config = {
    method: method || 'GET',
    uri: url,
    json: true,
    resolveWithFullResponse: true,
    headers: headers || {
      'User-Agent': 'dibosh'
    }
  };
  if (params) { config.qs = params; }
  if (data) { config.body = data; }
  return config;
}

utils.createEventResponse = function (event) {
  return {
    id: event.eventID,
    channel: {
      id: event.channelId,
      number: event.channelStbNumber,
      title: event.channelTitle
    },
    programTitle: event.programmeTitle,
    description: event.shortSynopsis || event.longSynopsis,
    genre: event.genre,
    subGenre: event.subGenre,
    directors: event.directors,
    producers: event.producers,
    actors: event.actors,
    featuredImage: event.epgEventImage,
    airingTime: event.displayDateTime,
    airingDuration: event.displayDuration
  };
};

utils.createChannelResponse = function (channel) {
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
};

module.exports = utils;
