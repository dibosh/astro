class ChannelsController {

  constructor($document, $uibModal, channels) {
    this._modalFactory = $uibModal;
    this._documentService = $document;

    this.channels = channels;
    this.isLoading = false;
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

ChannelsController.$inject = ['$document', '$uibModal', 'channels'];

export default ChannelsController;
