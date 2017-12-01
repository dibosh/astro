class ChannelsService {
  constructor(simpleHttpService) {
    this.simpleHttpService = simpleHttpService;
  }

  getChannels(pageSize, pageNumber) {
    return this.simpleHttpService.makeGETRequest('channels', {pageSize: pageSize, pageNumber: pageNumber});
  }

  getEvents(channelId, periodStart, periodEnd) {
    return this.simpleHttpService.makeGETRequest('channels/' + channelId + '/events', {periodStart: periodStart, periodEnd: periodEnd});
  }
}

ChannelsService.$inject = ['simpleHttpService'];

export default ChannelsService;

