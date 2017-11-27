export function ChannelTilesDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/channels/channel.tiles.directive/channel.tiles.html',
    scope: {
      isLoading: '=',
      channels: '=',
      totalChannels: '=',
      pageSize: '=',
      paginate: '&'
    },
    link: function (scope) {
      scope.paginationNavs = [
        {
          direction: 'left',
          icon: 'glyphicon-chevron-left'
        },
        {
          direction: 'right',
          icon: 'glyphicon-chevron-right'
        }
      ];

      scope.paginationConfig = {
        pageSize: parseInt(scope.pageSize),
        pageStart: 1,
        currentPage: 1
      };

      scope.getCurrentlyShowingInfo = function () {
        var currPos = (scope.paginationConfig.currentPage - 1) * scope.paginationConfig.pageSize + 1;
        var endPos = currPos + scope.paginationConfig.pageSize - 1;
        currPos = currPos <= 0 ? scope.paginationConfig.pageStart : currPos;
        endPos = endPos > scope.totalChannels ? scope.totalChannels : endPos;
        return `Showing <strong>${currPos}-${endPos}</strong> of <strong>${scope.totalChannels}</strong> channels`;
      };

      scope.onPaginate = function (direction) {
        var currentPage = scope.paginationConfig.currentPage;

        direction === 'left' ? currentPage -= 1 :  currentPage+= 1;
        
        if (currentPage < scope.paginationConfig.pageStart) {
          currentPage = scope.paginationConfig.pageStart;
        }

        if (currentPage > scope.paginationConfig.pageEnd) {
          currentPage = scope.paginationConfig.pageEnd;
        }

        scope.paginationConfig.currentPage = currentPage;

        scope.paginate({pageSize: scope.paginationConfig.pageSize, pageNumber: scope.paginationConfig.currentPage});
      };

      scope.toggleFavoriteFor = function (channel) {
        channel.isFavorite = !channel.isFavorite;
      };

      scope.$watch('totalChannels', function (totalChannels) {
        scope.paginationConfig.pageEnd = Math.ceil(totalChannels / scope.paginationConfig.pageSize);
      });
    }
  };

  return directive;
}

