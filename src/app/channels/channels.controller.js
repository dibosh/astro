class ChannelsController {

  constructor($document, $uibModal, UserBasket, userService, toastr, channels) {
    this._modalFactory = $uibModal;
    this._documentService = $document;
    this._UserBasket = UserBasket;
    this._userService = userService;
    this._toastr = toastr;

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
    if (isFavorite) {
      this._UserBasket.user.favoriteChannelIds.push(channelId);
    } else {
      let removeableIndex = this._.indexOf(this._UserBasket.user.favoriteChannelIds, channelId);
      if (removeableIndex > 0) {
        this._UserBasket.user.favoriteChannelIds.splice(removeableIndex, 1);
      }
    }

    this._userService.updateUser()
      .then((updatedUser) => {
        this._UserBasket.user = updatedUser;
        this._toastr.success('Successfully saved the favorites.');
      })
      .catch(() => {
        this._toastr.warning('Could not save the favorites.');
      });
  }
}

ChannelsController.$inject = ['$document', '$uibModal', 'UserBasket', 'userService', 'toastr', 'channels'];

export default ChannelsController;
