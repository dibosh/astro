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

      scope.getCurrentlyShowingInfo = function () {
        let currPos = (scope.paginationConfig.currentPage - 1) * scope.paginationConfig.pageSize + 1;
        let endPos = currPos + scope.paginationConfig.pageSize - 1;
        currPos = currPos <= 0 ? scope.paginationConfig.pageStart : currPos;
        endPos = endPos > scope.totalChannels ? scope.totalChannels : endPos;
        return `Showing <strong>${currPos}-${endPos}</strong> of <strong>${scope.totalChannels}</strong> channels`;
      };

      scope.isPaginationInvalidForDirection = function (direction) {
        let startPage = scope.paginationConfig.pageStart;
        let endPage = scope.paginationConfig.pageEnd;
        let invalidLeft = (direction === 'left' && scope.paginationConfig.currentPage === startPage);
        let invalidRight = (direction === 'right' && scope.paginationConfig.currentPage === endPage);
        return  invalidLeft || invalidRight;
      };

      scope.onPaginate = function (direction) {
        let currentPage = scope.paginationConfig.currentPage;

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

