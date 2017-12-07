export function ChannelTilesDirective(UserBasket, _) {
  'ngInject';

  let directive = {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/channels/channel.tiles.directive/channel.tiles.html',
    scope: {
      isLoading: '=',
      channels: '=',
      onChannelClick: '&',
      onFavoriteClick: '&'
    },
    link: function (scope) {
      scope.sortByOptions = [
        {
          label: 'Title',
          value: 'title'
        },
        {
          label: 'Channel Number',
          value: 'setTopBoxNumber'
        }
      ];

      scope.sortBy = function (selectedSortOption) {
        scope.sortChannelsBy = selectedSortOption.value;
      };

      scope.isFavorite = function (channel) {
        if (UserBasket.user) {
          return _.indexOf(UserBasket.user.favoriteChannelIds, channel.channelId) !== -1;
        }
        return false;
      };

      scope.toggleFavoriteFor = function (channel, event) {
        event.stopPropagation();
        event.preventDefault();
        let isFavorite = scope.isFavorite(channel);
        scope.onFavoriteClick({channel: channel, isFavorite: !isFavorite});
      };
    }
  };

  return directive;
}

