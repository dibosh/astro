export function config ($logProvider, toastrConfig, $authProvider) {
  'ngInject';
  // Enable log
  $logProvider.debugEnabled(true);

  // Set options third-party lib
  toastrConfig.allowHtml = true;
  toastrConfig.timeOut = 3000;
  toastrConfig.positionClass = 'toast-top-right';
  toastrConfig.preventDuplicates = true;
  toastrConfig.progressBar = true;

  // configure auth provider for facebook
  $authProvider.facebook({
    clientId: '114659072652866', // orig
    // clientId: '1215110728590242', // test app
  });
}
