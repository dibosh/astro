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

  updateUser() {
    return this.httpService.makePUTRequest('user/me', this.UserBasket.user, this._getAuthHeader())
      .then((updatedUser) => {
        return updatedUser;
      });
  }

  _getAuthHeader() {
    return {
      Authorization: this.$auth.getToken()
    };
  }
}

UserService.$inject = ['simpleHttpService', '$auth', 'UserBasket', '$q', '_'];

export default UserService;
