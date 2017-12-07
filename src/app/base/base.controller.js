class BaseController {
  constructor ($rootScope, DestroyListener) {
    this.isStateLoading = false;
    this.navs = [
      {
        title: 'Channels',
        stateName: 'channels'
      },
      {
        title: 'TV Guide',
        stateName: 'tv-guide'
      }
    ];

    let stateChangeStartListener = $rootScope.$on('$stateChangeStart', () => {
      this.isStateLoading = true;
    });

    let stateChangeEndListener = $rootScope.$on('$stateChangeSuccess', () => {
      this.isStateLoading = false;
    });

    DestroyListener.addObserver(stateChangeEndListener);
    DestroyListener.addObserver(stateChangeStartListener);

    this.brand = {
      url: 'https://www.astro.com.my/',
      logo: 'app/assets/images/logo.png'
    };
  }
}

BaseController.$inject = ['$rootScope', 'DestroyListener'];

export default BaseController;
