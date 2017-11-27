import ChannelsController from './channels.controller';
import {ChannelTilesDirective} from './channel.tiles.directive/channel.tiles.directive'
import ChannelsService from './channels.service';

angular.module('astro.channels', [])
  .controller('ChannelsController', ChannelsController)
  .service('channelsService', ChannelsService)
  .directive('channelTiles', ChannelTilesDirective);
