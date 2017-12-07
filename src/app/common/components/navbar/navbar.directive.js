export function NavbarDirective($auth, $rootScope, DestroyListener, userService) {
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

      let onUserUpdate = $rootScope.$on('onUserUpdate', (event, args) => {
        scope.currentUser = args.user;
      });

      DestroyListener.addObserver(onUserUpdate);

      scope.toggleCollapse = function () {
        scope.isNavbarCollapsed = !scope.isNavbarCollapsed;
      };

      scope.logOut = function () {
        $auth.logout();
        userService.logOutUser();
      }
    }
  };

  return directive;
}
