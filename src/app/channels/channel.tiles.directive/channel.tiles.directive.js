export function ChannelTilesDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/channels/channel.tiles.directive/channel.tiles.html',
    scope: {
      isLoading: '=',
      channels: '='
    },
    link: function (scope) {
      scope.toggleFavoriteFor = function (channel) {
        channel.isFavorite = !channel.isFavorite;
      };
    }
  };

  return directive;
}

