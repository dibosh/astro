class ChannelsController {

  constructor(channelsService) {
    this.pageSize = 12;
    this.channelsService = channelsService;
    this.paginate(this.pageSize, 1);
  }

  paginate(pageSize, pageNumber) {
    let self = this;
    self.isLoading = true;
    self.channelsService.getChannels(pageSize, pageNumber)
      .then((response) => {
        self.channels = response.channels;
        if (!self.totalChannels) {
          self.totalChannels = response.numFound;
        }
      })
      .finally(() => {
        self.isLoading = false;
      });
  }
}

ChannelsController.$inject = ['channelsService'];

export default ChannelsController;
