export function EventTableDirective(_) {
  'ngInject';

  let directive = {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/tv.guide/event.table.directive/event.table.html',
    scope: {
      totalCount: '=',
      events: '=',
      pageSize: '=',
      paginate: '&',
      onEventClick: '&'
    },
    link: function (scope) {
      scope.currentPage = 1;
      scope.headers = [
        'channel',
        'programTitle',
        'description',
        'genre',
        'airingTime',
        'airingDuration'
      ];

      scope.isChannelInfo = function (ongoingHeader) {
        return ongoingHeader === 'channel';
      };

      scope.isAiringTimeInfo = function (ongoingHeader) {
        return ongoingHeader === 'airingTime';
      };

      scope.isNormalInfo = function (ongoingHeader) {
        return !scope.isAiringTimeInfo(ongoingHeader) && !scope.isChannelInfo(ongoingHeader);
      };

      scope.sortByOptions = [
        {
          label: 'Title',
          value: 'title'
        },
        {
          label: 'Channel Number',
          value: 'number'
        }
      ];

      scope.sortBy = function (selectedSortOption) {
        var sortChannelsBy = selectedSortOption.value;
        scope.events = _.sortBy(scope.events, (event) => { return event.channel[sortChannelsBy]; });
      };

      scope.onPageChange = function () {
        scope.paginate({currentPage: scope.currentPage});
      };
    }
  };

  return directive;
}

