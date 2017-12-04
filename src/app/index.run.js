/* global FB:false */

export function runBlock($log, $window, $document) {
  'ngInject';
  $log.debug('runBlock end');

  $window.fbAsyncInit = function () {
    FB.init({
      appId: '114659072652866',
      status: false,
      cookie: true,
      xfbml: false,
      version: 'v2.8'
    });
  };

  function appendFBSDK(d) {
    var js,
      id = 'facebook-jssdk',
      ref = d.getElementsByTagName('script')[0];

    if (d.getElementById(id)) {
      return;
    }

    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';

    ref.parentNode.insertBefore(js, ref);
  }

  appendFBSDK($document[0]);
}
