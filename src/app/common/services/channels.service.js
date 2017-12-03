class ChannelsService {
  constructor(simpleHttpService) {
    this.simpleHttpService = simpleHttpService;
  }

  getChannels(pageSize, pageNumber) {
    if (pageSize && pageNumber) {
      return this.simpleHttpService.makeGETRequest('channels', {pageSize: pageSize, pageNumber: pageNumber});
    } else {
      return this.simpleHttpService.makeGETRequest('channels/all');
    }
  }

  getEventsForChannel(channelId, periodStart, periodEnd) {
    return this.simpleHttpService.makeGETRequest('channels/' + channelId + '/events', {periodStart: periodStart, periodEnd: periodEnd});
  }

  getEventsForAllChannels(periodStart, periodEnd) {
    var requestConfig = {
      startDate: periodStart,
      endDate: periodEnd
    };
    return this.simpleHttpService.makeGETRequest('events/all', requestConfig);
  }
}

ChannelsService.$inject = ['simpleHttpService'];

export default ChannelsService;

