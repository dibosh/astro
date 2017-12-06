class UserService {
  constructor(simpleHttpService, $auth, UserBasket, $q, _) {
    this.httpService = simpleHttpService;
    this.$auth = $auth;
    this.UserBasket = UserBasket;
    this.$q = $q;
    this._ = _;
  }

  getCurrentUser() {
    return this.httpService.makeGETRequest('user/me', null, this._getAuthHeader())
      .then((response) => {
        return response.user;
      });
  }

  addChannelToFavorites(channelId) {
    let deferred = this.$q.defer();
    let currentUser = this._checkCurrentUser(deferred);

    let favChannelIds = currentUser.favoriteChannelIds || [];
    favChannelIds.push(channelId);

    this._updateFavoriteChannels(favChannelIds, deferred);

    return deferred.promise;
  }

  removeChannelFromFavorites(channelId) {
    let deferred = this.$q.defer();
    let currentUser = this._checkCurrentUser(deferred);
    let favChannelIds = currentUser.favoriteChannelIds || [];
    let removableChannelIndex = _.indexOf(favChannelIds, channelId);
    favChannelIds.splice(removableChannelIndex, 1);

    this._updateFavoriteChannels(favChannelIds, deferred);

    return deferred.promise;
  }

  _updateFavoriteChannels(channelIds, deferred) {
    this.httpService.makePUTRequest('user/favoriteChannels', {channelIds: channelIds}, this._getAuthHeader())
      .then((response) => {
        return deferred.resolve(response);
      })
      .catch((err) => {
        return deferred.reject(err);
      });
  }

  _checkCurrentUser(deferred) {
    let currentUser = this.UserBasket.user;
    if (this._.isUndefined(currentUser)) {
      return deferred.reject({message: 'No current user.'});
    }

    return currentUser;
  }

  _getAuthHeader() {
    return {
      Authorization: this.$auth.getToken()
    };
  }
}

UserService.$inject = ['simpleHttpService', '$auth', 'UserBasket', '$q', '_'];

export default UserService;
