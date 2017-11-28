export function OffClickDirective($document, $parse) {
  'ngInject';

  let directive = {
    compile: function ($element, attr) {
      var fn = $parse(attr['offClick']);
      return function (scope, element) {
        element.on('click', function (event) {
          event.stopPropagation();
        });

        $document.find('body').on('click', function (event) {
          scope.$apply(function () {
            fn(scope, {$event: event});
          });
        });
      };
    }
  };

  return directive;
}
