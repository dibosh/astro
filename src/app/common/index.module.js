import {NavbarDirective} from './components/navbar/navbar.directive';
import {DropdownDirective} from './components/dropdown/dropdown.directive'
import {OffClickDirective} from './components/off.click.directive'
import ChannelsService from './services/channels.service';
import SimpleHTTPService from './services/simple.http.service';

angular.module('astro.common', [])
  .directive('acmeNavbar', NavbarDirective)
  .directive('dropdown', DropdownDirective)
  .directive('offClick', OffClickDirective)
  .service('simpleHttpService', SimpleHTTPService)
  .service('channelsService', ChannelsService);
