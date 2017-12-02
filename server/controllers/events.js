var express = require('express');
var router = express.Router({mergeParams: true});
var utils = require('../common/utils');
var eventsUrl = utils.prepareEventsUrl(utils.configVersion);

router.get('/', function (req, res) {
  utils.handleHttpRequestPromise(_makeEventListResponse(req.query), res);
});

function _makeEventListResponse(query) {
  return utils.makeHttpRequest(null, eventsUrl,
    utils.prepareEventsRequestConfig(query.channelIds, query.startDate, query.endDate, utils.configVersion))
    .then(function (response) {
      var rawEvents = response.body.getevent;
      var eventsResp = [];
      rawEvents.forEach(function (event) {
        eventsResp.push(utils.createEventResponse(event));
      });

      return {
        status: response.body.responseCode,
        body: {
          numFound: rawEvents.length,
          events: eventsResp
        }
      };
    });
}

module.exports = router;
