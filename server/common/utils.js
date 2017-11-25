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

utils.makeHttpRequest = function (method, url, headers) {
  var requestConfig = _prepareHttpRequestConfig(method, url, headers);
  return request(requestConfig);
};

function _prepareHttpRequestConfig(method, url, headers) {
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

module.exports = utils;
