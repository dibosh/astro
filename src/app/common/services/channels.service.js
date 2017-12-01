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

  getEvents(channelId, periodStart, periodEnd) {
    return this.simpleHttpService.makeGETRequest('channels/' + channelId + '/events', {periodStart: periodStart, periodEnd: periodEnd});
  }
}

ChannelsService.$inject = ['simpleHttpService'];

export default ChannelsService;

