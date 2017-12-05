class LoginModalInstanceController {
  constructor($uibModalInstance, $auth) {
    this._$uibModalInstance = $uibModalInstance;
    this.auth = $auth;
  }

  fbLogin() {
    this.auth.authenticate('facebook')
      .then(function (response) {
        console.log(response);
      })
      .catch(function (response) {
        console.log(response);
      });
  }

  close() {
    this._$uibModalInstance.dismiss('cancel');
  }
}

LoginModalInstanceController.$inject = ['$uibModalInstance', '$auth'];

export default LoginModalInstanceController;
