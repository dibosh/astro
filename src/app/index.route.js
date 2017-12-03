export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('root', {
      abstract: true,
      template: '<div ui-view=""></div>',
      resolve: {
        channels: (_, $q, ChannelBasket) => {
          let preloaded = !_.isEmpty(ChannelBasket.channels);
          return  preloaded ? $q.when(ChannelBasket.channels) : ChannelBasket.retrieveChannels();
        }
      }
    });

  $stateProvider
    .state('channels', {
      parent: 'root',
      url: '/channels',
      templateUrl: 'app/channels/channels.html',
      controller: 'ChannelsController',
      controllerAs: 'vm'
    })
    .state('tv-guide', {
      parent: 'root',
      url: '/tv-guide',
      templateUrl: 'app/tv.guide/tv.guide.html',
      controller: 'TVGuideController',
      controllerAs: 'vm',
      resolve: {
        events: (_, $q, EventsBasket) => {
          let preloaded = !_.isEmpty(EventsBasket.events);
          return  preloaded ? $q.when(EventsBasket.events) : EventsBasket.retrieveEventsForAllChannels();
        }
      }
    });

  $urlRouterProvider.otherwise('/channels');
}
