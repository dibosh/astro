class UserBasket {
  constructor(_, $rootScope, userService) {
    this._ = _;
    this.$rootScope = $rootScope;
    this.userService = userService;
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

  get USER_UPDATED_NOTIFY() {
    return 'userUpdate';
  }

  _broadcast() {
    this.$rootScope.$broadcast(this.USER_UPDATED_NOTIFY, {user: this.user});
  }
}

UserBasket.$inject = ['_', '$rootScope', 'userService'];

export default UserBasket;
