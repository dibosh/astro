class ChannelsController {

  constructor($document, $uibModal, channelsService) {
    this._modalFactory = $uibModal;
    this._documentService = $document;
    this._channelsService = channelsService;

    this.pageSize = 12;
    this.channels = [];
    this.paginate(this.pageSize, 1);
  }

  paginate(pageSize, pageNumber) {
    this.isLoading = true;
    this._channelsService.getChannels(pageSize, pageNumber)
      .then((response) => {
        this.channels = response.channels;
        if (!this.totalChannels) {
          this.totalChannels = response.numFound;
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  showChannelDetails(channel) {
    this._modalFactory.open({
      animation: true,
      templateUrl: 'app/channels/partials/channel.details.modal.html',
      controller: 'ChannelDetailsModalInstanceController',
      controllerAs: 'modalCtrl',
      size: 'lg',
      appendTo: this._documentService.find('body'),
      resolve: {
        channel: () => {
          return channel;
        }
      }
    });
  }
}

ChannelsController.$inject = ['$document', '$uibModal', 'channelsService'];

export default ChannelsController;
