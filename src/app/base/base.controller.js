class BaseController {
  constructor ($rootScope, $auth, UserBasket) {
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

    if (UserBasket.shouldFetch()) {
      UserBasket.fetch()
        .then((user) => {
          this.user = user;
        })
        .catch((err) => {
          if (err.status === 404) {
            $auth.logout();
          }
        });
    } else {
      this.user = UserBasket.user;
    }

    let stateChangeStartListener = $rootScope.$on('$stateChangeStart', () => {
      this.isStateLoading = true;
    });

    let stateChangeEndListener = $rootScope.$on('$stateChangeSuccess', () => {
      this.isStateLoading = false;
    });

    $rootScope.$on('$destroy', () => {
      stateChangeEndListener();
      stateChangeStartListener();
    });

    $rootScope.$on(UserBasket.USER_UPDATED_NOTIFY, (data) => {
      this.user = data.user;
    });

    this.brand = {
      url: 'https://www.astro.com.my/',
      logo: 'app/assets/images/logo.png'
    };

    this.logOut = () => {
      $auth.logout();
      this.user = null;
    };
  }
}

BaseController.$inject = ['$rootScope', '$auth', 'UserBasket'];

export default BaseController;
