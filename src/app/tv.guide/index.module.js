import TVGuideController from './tv.guide.controller';
import {EventTableDirective} from './event.table.directive/event.table.directive';
angular.module('astro.tv-guide', [])
  .controller('TVGuideController', TVGuideController)
  .directive('eventTable', EventTableDirective);

