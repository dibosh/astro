class UserBasket {
  constructor(_, $rootScope, userService, $auth) {
    this._ = _;
    this.$rootScope = $rootScope;
    this.userService = userService;
    this.$auth = $auth;
  }

  shouldFetch() {
    return this._.isEmpty(this.user) && !this._.isEmpty(this.$auth.getToken());
  }

  fetch() {
    return this.userService.getCurrentUser()
      .then((user) => {
        this.user = user;
        return this.user;
      });
  }

  set user(user) {
    this._user = user;
    this._broadcast();
  }

  get user() {
    return this._user;
  }

  _broadcast() {
    this.$rootScope.$broadcast('onUserUpdate', {user: this.user});
  }
}

UserBasket.$inject = ['_', '$rootScope', 'userService', '$auth'];

export default UserBasket;
