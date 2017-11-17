export function NavbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/common/components/navbar/navbar.html',
    scope: {
      brandUrl: '@',
      brandLogo: '@',
      navItems: '='
    }
  };

  return directive;
}
