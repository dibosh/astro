class EventsBasket {
  constructor(_, channelsService, moment) {
    this._channelsService = channelsService;
    this._moment = moment;
    this._withinHours = 0.3;
    this._ = _;

    if (this._.isUndefined(this._events)) {
      this.retrieveEventsForAllChannels();
    }
  }

  retrieveEventsForAllChannels() {
    let dateFormat = 'YYYY-MM-DD HH:mm';
    let startDate = this._moment().format(dateFormat);
    let endDate = this._moment(startDate).add(this._withinHours, 'hours').format(dateFormat);
    return this._channelsService.getEventsForAllChannels(startDate, endDate)
      .then((response) => {
        this._events = response.events;
        this._lastUpdated = startDate;
        return this._events;
      });
  }

  shouldRefresh() {
    let dateFormat = 'YYYY-MM-DD HH:mm';
    let lastUpdated = this._moment(this._lastUpdated, dateFormat);
    let now = this._moment();
    let duration = this._moment.duration(now.diff(lastUpdated));
    return this._.isEmpty(this._events) || duration.asMinutes() >= (60 * this._withinHours);
  }

  getEventsForChannel(channelId) {
    return this._.filter(this._events, (event) => { return event.channelId === channelId; });
  }

  get events() {
    return this._events;
  }
}

EventsBasket.$inject = ['_', 'channelsService', 'moment'];

export default EventsBasket;
