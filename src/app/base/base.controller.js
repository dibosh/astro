export class BaseController {
  constructor () {
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

    this.brand = {
      url: 'https://www.astro.com.my/',
      logo: 'app/assets/images/logo.png'
    }
  }
}
