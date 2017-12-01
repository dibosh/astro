class ChannelDetailsModalInstanceController {
  constructor($uibModalInstance, channelsService, moment, _, channel) {
    this._$uibModalInstance = $uibModalInstance;
    this._channelsService = channelsService;
    this._moment = moment;
    this._ = _;

    this.isEventsLoading = false;
    this.channel = channel;
    this.channelEvents = [];

    this.loadEvents();
  }

  loadEvents() {
    this.isEventsLoading = true;
    let channelId = this.channel.id;
    let dateTimeFormat = 'YYYY-MM-DD HH:mm';
    let onlyDateFormat = 'YYYY-MM-DD';
    let currentDateTime = this._moment();
    let onlyDate = currentDateTime.format(onlyDateFormat);
    let periodStart = currentDateTime.format(dateTimeFormat);
    let periodEnd = onlyDate + ' 23:59';
    this._channelsService.getEvents(channelId, periodStart, periodEnd)
      .then((response) => {
        this.channelEvents = this._.map(response.events, (event)=>{
          event.airingTime = this._moment(event.airingTime).format('HH:mm');
          return event;
        });
      })
      .finally(()=> {
        this.isEventsLoading = false;
      })
  }

  close() {
    this._$uibModalInstance.dismiss('cancel');
  }
}

ChannelDetailsModalInstanceController.$inject = ['$uibModalInstance', 'channelsService', 'moment', '_', 'channel'];

export default ChannelDetailsModalInstanceController;
