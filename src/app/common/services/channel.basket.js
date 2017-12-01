class ChannelBasket {
  constructor(_, channelsService) {
    this._channelsService = channelsService;
    if (_.isUndefined(this._channels)) {
      this.retrieveChannels();
    }
  }

  retrieveChannels() {
    return this._channelsService.getChannels()
      .then((response) => {
        this._channels = response.channels;
        return this._channels;
      });
  }

  get channels() {
    return this._channels;
  }
}

ChannelBasket.$inject = ['_', 'channelsService'];

export default ChannelBasket;
