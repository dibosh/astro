class SimpleHTTPService {
  constructor($http) {
    this.$http = $http;
    this.baseUrl = '/api/';
  }

  makeGETRequest(endpoint, params, headers) {
    let config = {
      method: 'GET',
      url: this.baseUrl + endpoint,
      params: params,
      headers: headers
    };
    return this.$http(config).then((response)=> {
      return response.data;
    });
  }

  makePUTRequest(endpoint, body, headers) {
    let config = {
      method: 'PUT',
      url: this.baseUrl + endpoint,
      data: body,
      headers: headers
    };
    return this.$http(config).then((response)=> {
      return response.data;
    });
  }

  makePOSTRequest(endpoint, body, headers) {
    let config = {
      method: 'POST',
      url: this.baseUrl + endpoint,
      data: body,
      headers: headers
    };
    return this.$http(config).then((response)=> {
      return response.data;
    });
  }
}

SimpleHTTPService.$inject = ['$http'];

export default SimpleHTTPService;
