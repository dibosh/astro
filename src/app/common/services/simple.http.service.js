class SimpleHTTPService {
  constructor($http) {
    this.$http = $http;
    this.baseUrl = '/api/';
  }

  makeGETRequest(endpoint, params) {
    let config = {
      method: 'GET',
      url: this.baseUrl + endpoint,
      params: params
    };
    return this.$http(config).then((response)=> {
      return response.data;
    });
  }
}

SimpleHTTPService.$inject = ['$http'];

export default SimpleHTTPService;
