class ChannelsService {
  constructor(simpleHttpService) {
    this.simpleHttpService = simpleHttpService;
  }

  getChannels(pageSize, pageNumber) {
    return this.simpleHttpService.makeGETRequest('channels', {pageSize: pageSize, pageNumber: pageNumber});
  }
}

ChannelsService.$inject = ['simpleHttpService'];

export default ChannelsService;

