export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('channels', {
      url: '/channels',
      templateUrl: 'app/channels/channels.html',
      controller: 'ChannelsController',
      controllerAs: 'vm'
    })
    .state('tv-guide', {
      url: '/tv-guide',
      templateUrl: 'app/tv.guide/tv.guide.html',
      controller: 'TVGuideController',
      controllerAs: 'vm'
    });

  $urlRouterProvider.otherwise('/channels');
}
