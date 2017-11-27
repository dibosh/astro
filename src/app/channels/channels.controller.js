class ChannelsController {

  constructor(channelsService) {
    let self = this;
    self.isLoading = true;

    channelsService.getChannels(8, 1)
      .then((response) => {
        self.channels = response.channels;
      })
      .finally(() => {
        self.isLoading = false;
      });
  }
}

ChannelsController.$inject = ['channelsService'];

export default ChannelsController;
