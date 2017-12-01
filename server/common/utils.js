var API_URL = require('./config').API_URL;
var request = require('request-promise');

var utils = {};

utils.getErrorInterpretation = function (errorObject) {
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
};

utils.prepareUrl = function (path) {
  return API_URL + path;
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

module.exports = utils;
