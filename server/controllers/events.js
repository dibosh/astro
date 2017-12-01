var express = require('express');
var router = express.Router({mergeParams: true});
var utils = require('../common/utils');
var moment = require('moment');

router.get('/', function (req, res) {
  utils.handleHttpRequestPromise(_makeEventListResponse(req.params.channelId, req.query.startTime), res);
});

function _makeEventListResponse(channelId, startTime) {
  var url = utils.prepareUrl('ams/v3/getEvents');
  var onlyDate = moment(startTime).format('YYYY-MM-DD');
  var startTimeStr = moment(startTime).format('YYYY-MM-DD HH:mm');
  var endTimeStr = onlyDate + ' 23:59';
  return utils.makeHttpRequest(null, url, {channelId: channelId, periodStart: startTimeStr, periodEnd: endTimeStr})
    .then(function (response) {
      var rawEvents = response.body.getevent;
      var eventsResp = [];
      rawEvents.forEach(function (event) {
        eventsResp.push(createEventResponse(event));
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

function createEventResponse(event) {
  return {
    id: event.eventID,
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
}

module.exports = router;
