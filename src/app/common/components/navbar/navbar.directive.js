export function NavbarDirective($auth, $rootScope) {
  'ngInject';

  let directive = {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/common/components/navbar/navbar.html',
    scope: {
      brandUrl: '@',
      brandLogo: '@',
      navItems: '=',
      isPageLoading: '='
    },
    link: function (scope) {
      scope.isNavbarCollapsed = true;

      $rootScope.$on('onUserUpdate', (event, args) => {
        scope.currentUser = args.user;
      });

      scope.toggleCollapse = function () {
        scope.isNavbarCollapsed = !scope.isNavbarCollapsed;
      };

      scope.logOut = function () {
        $auth.logout();
      }
    }
  };

  return directive;
}
