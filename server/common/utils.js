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

utils.makeHttpRequest = function (method, url, params, headers) {
  var requestConfig = _prepareHttpRequestConfig(method, url, params, headers);
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

function _prepareHttpRequestConfig(method, url, params, headers) {
  return {
    method: method || 'GET',
    url: url,
    json: true,
    params: params,
    resolveWithFullResponse: true,
    headers: headers || {
      'User-Agent': 'dibosh'
    }
  };
}

module.exports = utils;
