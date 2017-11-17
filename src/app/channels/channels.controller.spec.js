describe('controllers', () => {
  let vm;

  beforeEach(angular.mock.module('astro'));

  beforeEach(inject(($controller) => {
    vm = $controller('ChannelsController');
  }));

  it('should have a basic title', () => {
    expect(vm.title).toEqual('My Astro');
  });
});
