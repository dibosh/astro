class TVGuideController {
  constructor(_, $q, ChannelBasket, moment, events) {
    this.pageSize = 12;
    this._ = _;
    this.ChannelBasket = ChannelBasket;
    this.moment = moment;
    this.$q = $q;
    this._prepare(events);
  }

  _groupifyChannelInfo(event) {
    let keys = ['channelId', 'channelNumber', 'channelTitle', 'channelLogo'];
    var channel = {};
    this._.each(keys, (key) => {
      let newKey = (/(?:[a-z]+([A-Z][a-z]+))/.exec(key)[1]).toLowerCase();
      channel[newKey] = event[key];
    });

    event.channel = channel;
    return event;
  }

  _getDisplayableEvents(events) {
    let deferred = this.$q.defer();

    events = this._.map(events, (event) => {
      event.channelLogo = this.ChannelBasket.getChannelLogo(event.channelId);
      event.airingTime = this.moment(event.airingTime, 'YYYY-MM-DD HH:mm').format('HH:mm A');
      event = this._groupifyChannelInfo(event);
      return event;
    });

    deferred.resolve(events);

    return deferred.promise;

  }

  _prepare(events) {
    this.preparingEventsForDisplay = true;
    this._getDisplayableEvents(events)
      .then((displayableEvents) => {
        this.events = displayableEvents;
        this.setCurrentPage(1);
        this.preparingEventsForDisplay = false;
      });
  }

  setCurrentPage(currentPage) {
    var offset = parseInt(currentPage || 1) - 1;
    this.displayedEvents = this.events.slice(offset * this.pageSize, offset * this.pageSize + this.pageSize);
  }
}

TVGuideController.$inject = ['_', '$q', 'ChannelBasket', 'moment', 'events'];

export default TVGuideController;
