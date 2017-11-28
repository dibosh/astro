export function DropdownDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/common/components/dropdown/dropdown.html',
    scope: {
      items: '=',
      labelKey: '=',
      valueKey: '=',
      onItemSelect: '&'
    },
    link: function (scope) {
      scope.isOpen = false;

      scope.toggleDropdown = function () {
        scope.isOpen = !scope.isOpen;
      };

      scope.selectItem = function (item) {
        scope.selectedItem = item;
        scope.onItemSelect({selectedItem: scope.selectedItem});
        scope.isOpen = false;
      };

      scope.closeDropdown = function () {
        scope.isOpen = false;
      };

      scope.selectItem(scope.items[0]);
    }
  };

  return directive;
}
