/* global moment:false _:false */

import {config} from './index.config';
import {routerConfig} from './index.route';
import {runBlock} from './index.run';
import './base/index.module';
import './channels/index.module';
import './tv.guide/index.module';
import './common/index.module';

angular.module('astro', [
    'ngAnimate',
    'ngSanitize',
    'ngMessages',
    'ui.router',
    'ui.calendar',
    'ui.bootstrap',
    'toastr',
    'satellizer',
    // App specific modules
    'astro.base',
    'astro.common',
    'astro.channels',
    'astro.tv-guide'
  ])
  .constant('moment', moment)
  .constant('_', _)
  .config(config)
  .config(routerConfig)
  .run(runBlock);
