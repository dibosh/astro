import ChannelsController from './channels.controller';
import {ChannelTilesDirective} from './channel.tiles.directive/channel.tiles.directive';
import ChannelDetailsModalInstanceController from './channel.details.modal.instance.controller';
import LoginModalInstanceController from './login.modal.instance.controller';

angular.module('astro.channels', [])
  .controller('ChannelsController', ChannelsController)
  .controller('ChannelDetailsModalInstanceController', ChannelDetailsModalInstanceController)
  .controller('LoginModalInstanceController', LoginModalInstanceController)
  .directive('channelTiles', ChannelTilesDirective);
