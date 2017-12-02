export function EventTableDirective(moment) {
  'ngInject';

  let directive = {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/tv.guide/event.tiles.directive/event.tiles.html',
    scope: {
      headers: '=',
      events: '=',
      pageSize: '=',
      paginate: '&',
      onEventClick: '&'
    },
    link: function (scope) {
      scope.isChannelInfo = function (ongoingHeader) {
        return ongoingHeader === 'channel';
      };

      scope.isAiringTimeInfo = function (ongoingHeader) {
        return ongoingHeader === 'airingTime';
      };

      scope.getTimeInfo = function (time) {
        return moment(time, 'HH:mm');
      };

      scope.isNormalInfo = function (ongoingHeader) {
        return !scope.isAiringTimeInfo(ongoingHeader) && !scope.isChannelInfo(ongoingHeader);
      };

      scope.$watch('events', function (events) {

      });
      scope.pageChanged = function () {

      }
    }
  };

  return directive;
}

