export function NavbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/common/components/navbar/navbar.html',
    scope: {
      brandUrl: '@',
      brandLogo: '@',
      navItems: '='
    },
    link: function (scope) {
      scope.isNavbarCollapsed = true;

      scope.toggleCollapse = function () {
        scope.isNavbarCollapsed = !scope.isNavbarCollapsed;
      }
    }
  };

  return directive;
}
