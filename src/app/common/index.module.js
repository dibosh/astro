import {NavbarDirective} from './components/navbar/navbar.directive';
import {DropdownDirective} from './components/dropdown/dropdown.directive';
import {OffClickDirective} from './components/off.click.directive';
import {PaginationDirective} from './components/pagination/pagination.directive';
import ChannelsService from './services/channels.service';
import UserService from './services/user.service';
import SimpleHTTPService from './services/simple.http.service';
import ChannelBasket from './services/channel.basket';
import EventsBasket from './services/events.basket';
import UserBasket from './services/user.basket';
import DestroyListener from './services/destroy.listener';

angular.module('astro.common', [])
  .directive('acmeNavbar', NavbarDirective)
  .directive('dropdown', DropdownDirective)
  .directive('offClick', OffClickDirective)
  .directive('pagination', PaginationDirective)
  .service('simpleHttpService', SimpleHTTPService)
  .service('channelsService', ChannelsService)
  .service('userService', UserService)
  .service('ChannelBasket', ChannelBasket)
  .service('EventsBasket', EventsBasket)
  .service('UserBasket', UserBasket)
  .service('DestroyListener', DestroyListener);
