export function PaginationDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/common/components/pagination/pagination.html',
    scope: {
      pageSize: '=',
      totalItems: '=',
      paginate: '='
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

      scope.$watch('totalItems', function (totalItems) {
        scope.paginationConfig.pageEnd = Math.ceil(totalItems / scope.paginationConfig.pageSize);
      });

      scope.getCurrentlyShowingInfo = function () {
        let currPos = (scope.paginationConfig.currentPage - 1) * scope.paginationConfig.pageSize + 1;
        let endPos = currPos + scope.paginationConfig.pageSize - 1;
        currPos = currPos <= 0 ? scope.paginationConfig.pageStart : currPos;
        endPos = endPos > scope.totalItems ? scope.totalItems : endPos;
        return `Showing <strong>${currPos}-${endPos}</strong> of <strong>${scope.totalItems}</strong> channels`;
      };

      scope.isPaginationInvalidForDirection = function (direction) {
        let startPage = scope.paginationConfig.pageStart;
        let endPage = scope.paginationConfig.pageEnd;
        let invalidLeft = (direction === 'left' && scope.paginationConfig.currentPage === startPage);
        let invalidRight = (direction === 'right' && scope.paginationConfig.currentPage === endPage);
        return invalidLeft || invalidRight;
      };

      scope.onPaginate = function (direction) {
        let currentPage = scope.paginationConfig.currentPage;

        direction === 'left' ? currentPage -= 1 : currentPage += 1;

        if (currentPage < scope.paginationConfig.pageStart) {
          currentPage = scope.paginationConfig.pageStart;
        }

        if (currentPage > scope.paginationConfig.pageEnd) {
          currentPage = scope.paginationConfig.pageEnd;
        }

        scope.paginationConfig.currentPage = currentPage;
        scope.paginate({pageSize: scope.paginationConfig.pageSize, pageNumber: scope.paginationConfig.currentPage});
      };
    }
  };

  return directive;
}
