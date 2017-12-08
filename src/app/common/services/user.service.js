class UserService {
  constructor(simpleHttpService, $auth, $q, _, $http) {
    this.httpService = simpleHttpService;
    this.$auth = $auth;
    this.$q = $q;
    this._ = _;
    this.$http = $http;
  }

  getCurrentUser() {
    return this.httpService.makeGETRequest('user/me', null, this._getAuthHeader())
      .then((response) => {
        return response.user;
      });
  }

  updateUser(user) {
    return this.httpService.makePUTRequest('user/me', user, this._getAuthHeader())
      .then((updatedUser) => {
        return updatedUser;
      });
  }

  logOutUser(user) {
    let config = {
      method: 'POST',
      url: '/auth/logout',
      data: {facebookProfileId: user.facebookProfileId}
    };
    return this.$http(config).then((response)=> {
      return response.data;
    });
  }

  _getAuthHeader() {
    return {
      Authorization: this.$auth.getToken()
    };
  }
}

UserService.$inject = ['simpleHttpService', '$auth', '$q', '_', '$http'];

export default UserService;
