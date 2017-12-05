class ChannelsController {

  constructor($document, $uibModal, LocalStorage, channels) {
    this._modalFactory = $uibModal;
    this._documentService = $document;
    this._localStorage = LocalStorage;

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

  onFavoriteClick(channel, isFavorite) {
    let fbAuthToken = this._localStorage.get('fbAuthToken');
    if (!fbAuthToken) {
      this._showLogin();
    }
  }

  _showLogin() {
    this._modalFactory.open({
      animation: true,
      templateUrl: 'app/channels/partials/login.modal.html',
      controller: 'LoginModalInstanceController',
      controllerAs: 'modalCtrl',
      size: 'sm',
      appendTo: this._documentService.find('body')
    });
  }
}

ChannelsController.$inject = ['$document', '$uibModal', 'LocalStorage', 'channels'];

export default ChannelsController;
