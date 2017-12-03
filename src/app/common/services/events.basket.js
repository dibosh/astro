class EventsBasket {
  constructor(_, channelsService, moment, ChannelBasket) {
    this._channelsService = channelsService;
    this._moment = moment;
    this._withinHours = 6;
    this._ChannelBasket = ChannelBasket;
    this._ = _;

    if (_.isUndefined(this._events)) {
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
        return this._events;
      });
  }

  getEventsForChannel(channelId) {
    return this._.filter(this._events, (event) => { return event.channelId === channelId; });
  }

  get events() {
    return this._events;
  }
}

EventsBasket.$inject = ['_', 'channelsService', 'moment', 'ChannelBasket'];

export default EventsBasket;
