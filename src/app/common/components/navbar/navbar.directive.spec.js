describe('directive navbar', function() {
  let element;

  beforeEach(angular.mock.module('astro'));

  beforeEach(inject(($compile, $rootScope) => {
    element = angular.element(`
      <acme-navbar></acme-navbar>
    `);

    $compile(element)($rootScope.$new());
    $rootScope.$digest();
  }));

  it('should be compiled', () => {
    expect(element.html()).not.toEqual(null);
  });

  it('should have the navigation url list', () => {
    expect(element.find('ul.nav')).toBeDefined();
  });
});
