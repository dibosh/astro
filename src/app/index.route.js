export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('channels', {
      url: '/',
      templateUrl: 'app/channels/channels.html',
      controller: 'ChannelsController',
      controllerAs: 'vm'
    });

  $urlRouterProvider.otherwise('/');
}
