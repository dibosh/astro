class ChannelBasket {
  constructor(_, channelsService) {
    this._channelsService = channelsService;
    this._ = _;
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

  getChannelCategories() {
    return this._.map(this._channels, (channel) => {
      this._.get(channel, 'category');
    });
  }

  getChannel(channelId) {
    return this._.find(this._channels, (channel) => { return channel.id === channelId; });
  }

  get channels() {
    return this._channels;
  }
}

ChannelBasket.$inject = ['_', 'channelsService'];

export default ChannelBasket;
