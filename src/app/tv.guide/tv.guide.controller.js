class TVGuideController {
  constructor(_, channelsService, moment, channels) {
    this.title = 'Currently Airing';
    this.pageSize = 12;
    this._channelsService = channelsService;
    this._ = _;
    this._moment = moment;
    this.channels = channels;
    this.eventTableHeaders = [
      'channel',
      'programTitle',
      'description',
      'genre',
      'airingTime',
      'airingDuration'
    ];
  }

  paginate(pageSize, pageNumber) {
    this.isEventsLoading = true;
    pageSize = parseInt(pageSize || 10);
    let offset = parseInt(pageNumber || 1) - 1;
    let channelSlice = this.channels.slice(offset * pageSize, offset * pageSize + pageSize);
    let channelIds = this._.map(channelSlice, (channel) => { return channel.id; }).join(',');
    let dateTimeFormat = 'YYYY-MM-DD HH:mm';
    let periodStart = this._moment().format(dateTimeFormat);
    let periodEnd = periodStart;
    this._channelsService.getEvents(channelIds, periodStart, periodEnd)
      .then((response) => {
        this.channelEvents = this._.map(response.events, (event)=>{
          event.airingTime = this._moment(event.airingTime).format('HH:mm');
          return event;
        });
      })
      .finally(()=> {
        this.isEventsLoading = false;
      });

    this.channelEvents = this._.map(response.events, (event)=> {
      event.airingTime = this._moment(event.airingTime).format('HH:mm');
      return event;
    });
  }
}

TVGuideController.$inject = ['_', 'channelsService', 'moment', 'channels'];

export default TVGuideController;
