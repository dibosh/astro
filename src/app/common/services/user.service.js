class UserService {
  constructor(simpleHttpService, $auth, UserBasket) {
    this.httpService = simpleHttpService;
    this.$auth = $auth;
  }

  getCurrentUser() {
    let headers = {
      Authorization: this.$auth.getToken()
    };
    
    return this.httpService.makeGETRequest('user/me', null, headers)
      .then((response) => {
        return response.user;
      });
  }
  
  addChannelToFavorites(channelId) {
    
  }

  makePUTRequest(endpoint, body) {
    let config = {
      method: 'PUT',
      url: this.baseUrl + endpoint,
      data: body
    };
    return this.$http(config).then((response)=> {
      return response.data;
    });
  }
}

UserService.$inject = ['simpleHttpService', '$auth', 'UserBasket'];

export default UserService;
