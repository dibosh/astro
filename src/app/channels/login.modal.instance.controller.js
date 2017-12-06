class LoginModalInstanceController {
  constructor($uibModalInstance, $auth, UserBasket, _) {
    this._$uibModalInstance = $uibModalInstance;
    this.auth = $auth;
    this._ = _;
    this.UserBasket = UserBasket;
  }

  fbLogin() {
    this.auth.authenticate('facebook')
      .then((response) => {
        this.UserBasket.user = response.data.user;
        this._$uibModalInstance.close();
      })
      .catch((response) => {
        this.error = response.message ? response : response.data;
      });
  }

  close() {
    this._$uibModalInstance.dismiss('cancel');
  }

  hasError() {
    return !this._.isUndefined(this.error);
  }
}

LoginModalInstanceController.$inject = ['$uibModalInstance', '$auth', 'UserBasket', '_'];

export default LoginModalInstanceController;
