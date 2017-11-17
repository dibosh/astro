export class BaseController {
  constructor () {
    this.navs = [
      {
        title: 'Channels',
        url: '/'
      },
      {
        title: 'TV Guide',
        url: '/tv-guide'
      }
    ];

    this.title = 'My Astro';
  }
}
