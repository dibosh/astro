var memCache = require('memory-cache');

var cache = function (durationInMins) {
  return function (req, res, next) {
    var key = '__express__' + req.originalUrl || req.url;
    var cachedBody = memCache.get(key);
    if (cachedBody) {
      res.status(200).send(cachedBody);
    } else {
      res.sendResponse = res.send;
      res.send = function (actualResponseBody) {
        memCache.put(key, actualResponseBody, durationInMins * 60 * 1000);
        res.sendResponse(actualResponseBody);
      }
    }
    next();
  }
};

module.exports = cache;
