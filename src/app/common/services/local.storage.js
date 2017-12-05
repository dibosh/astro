class LocalStorage {
  constructor($window) {
    this._localStorage = $window.localStorage;
  }

  get(key) {
    return this._localStorage.getItem(key);
  }

  set(key, value) {
    this._localStorage.setItem(key, JSON.stringify(value));
  }
}

LocalStorage.$inject = ['$window'];

export default LocalStorage;
