import {NavbarDirective} from './components/navbar/navbar.directive';
import SimpleHTTPService from './simple.http.service';

angular.module('astro.common', [])
  .directive('acmeNavbar', NavbarDirective)
  .service('simpleHttpService', SimpleHTTPService);
