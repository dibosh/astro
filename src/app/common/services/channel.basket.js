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

  getChannel(channelId) {
    return this._.find(this._channels, (channel) => { return channel.channelId === channelId; });
  }

  getChannelLogo(channelId) {
    return this._.get(this.getChannel(channelId), 'logo');
  }

  get channels() {
    return this._channels;
  }
}

ChannelBasket.$inject = ['_', 'channelsService'];

export default ChannelBasket;
