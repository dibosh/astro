import { NavbarDirective } from './components/navbar/navbar.directive';

angular.module('astro.common', [])
  .directive('acmeNavbar', NavbarDirective);
