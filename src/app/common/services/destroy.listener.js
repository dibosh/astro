class DestroyListener {
  constructor($rootScope) {
    this.$rootScope = $rootScope;
    this._observers = [];

    $rootScope.$on('$destroy', () => {
      this._observers.forEach((observer) => {
        observer();
      });
    });
  }

  addObserver(observer) {
    this._observers.push(observer);
  }
}

DestroyListener.$inject = ['$rootScope'];

export default DestroyListener;
