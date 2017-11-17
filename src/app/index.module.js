/* global moment:false */

import {config} from './index.config';
import {routerConfig} from './index.route';
import {runBlock} from './index.run';
import './base/index.module';
import './channels/index.module';
import './common/index.module';

angular.module('astro', [
    'ngAnimate',
    'ngSanitize',
    'ngMessages',
    'ui.router',
    'ui.bootstrap',
    'toastr',
    // App specific modules
    'astro.base',
    'astro.channels',
    'astro.common'
  ])
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock);
