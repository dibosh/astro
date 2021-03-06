class ChannelsController {

  constructor($document, $uibModal, UserBasket, userService, $auth, toastr, _, channels) {
    this._modalFactory = $uibModal;
    this._documentService = $document;
    this._UserBasket = UserBasket;
    this._userService = userService;
    this._toastr = toastr;
    this._auth = $auth;
    this._ = _;

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
    if (!this._auth.isAuthenticated()) {
      this._showLogin().result
        .then(()=> {
          this._updateUserFavoriteChannels(channel.channelId, isFavorite);
        });
    } else {
      this._updateUserFavoriteChannels(channel.channelId, isFavorite);
    }
  }

  _showLogin() {
    return this._modalFactory.open({
      animation: true,
      templateUrl: 'app/channels/partials/login.modal.html',
      controller: 'LoginModalInstanceController',
      controllerAs: 'modalCtrl',
      size: 'sm',
      appendTo: this._documentService.find('body')
    });
  }

  _updateUserFavoriteChannels(channelId, isFavorite) {
    if (!this._UserBasket.user) {
      return;
    }

    let favoriteChannelsSet = new Set(this._UserBasket.user.favoriteChannelIds);
    favoriteChannelsSet[isFavorite ? 'add' : 'delete'](channelId);
    this._UserBasket.user.favoriteChannelIds = Array.from(favoriteChannelsSet);

    this._userService.updateUser(this._UserBasket.user)
      .then((updatedUser) => {
        this._UserBasket.user = updatedUser;
        this._toastr.success('Successfully updated the favorites.');
      })
      .catch(() => {
        this._toastr.warning('Could not update the favorites.');
      });
  }
}

ChannelsController.$inject = ['$document', '$uibModal', 'UserBasket', 'userService', '$auth', 'toastr', '_', 'channels'];

export default ChannelsController;
