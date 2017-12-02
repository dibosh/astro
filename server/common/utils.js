var request = require('request-promise');
var mongoose = require('mongoose');
var _ = require('lodash');
var Channel = require('../models/channel');
var Settings = require('../models/settings');

var utils = {};
utils.configVersion = '';

utils.initializeDB = function () {
  if (_.isUndefined(utils.db)) {
    var config = require('./config' + utils.configVersion);
    var dbURI = 'mongodb://' + config.MONGO_HOST + ':27017/' + config.MONGO_DB;
    utils.db = mongoose.connect(dbURI, { useMongoClient: true });

    mongoose.connection.on('connected', function () {
      console.log('Mongoose default connection open to ' + dbURI);
      // load global settings
      utils.loadGlobalSettings();
    });

    mongoose.connection.on('error', function (err) {
      console.log('Mongoose default connection error: ' + err);
    });

    mongoose.connection.on('disconnected', function () {
      console.log('Mongoose default connection disconnected');
    });
  }
};

utils.getDB = function () {
  return utils.db;
};

utils.shutdownDB = function () {
  if (utils.db) {
    mongoose.disconnect();
  }
};

utils.loadGlobalSettings = function () {
  var settingsId = 'f9b327e70bbcf42494ccb28b2d98e00e'; // some random ID

  if (_.isEmpty(utils.globalSettings)) {
    Settings.find({settingsId: settingsId}, function (err, settings) {
      if (err) {
        throw err;
      }

      if (_.isEmpty(settings)) {
        settings = Settings({
          settingsId: settingsId,
          isChannelsCached: false
        });
        settings.save(function (err) {
          if (err) {
            throw err;
          }

          utils.globalSettings = settings;
        });
      } else {
        utils.globalSettings = settings;
      }
    });
  }
};

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

utils.createChannelInstanceFromRaw = function (channel) {
  return Channel({
    title: channel.channelTitle,
    description: channel.channelDescription,
    category: channel.channelCategory,
    channelId: channel.channelId,
    isHD: channel.channelHD,
    setTopBoxNumber: channel.channelStbNumber,
    language: channel.channelLanguage,
    color: channel.channelColor1 || channel.channelColor2 || channel.channelColor3,
    logo: channel.channelExtRef[0].value
  });
};

module.exports = utils;
