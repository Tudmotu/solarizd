import 'angular';
import solTabs from './sol-tabs/sol-tabs.js';
import solInput from './sol-input/sol-input.js';
import solPopmenu from './sol-popmenu/sol-popmenu.js';

export default angular.module('ui-kit', [])
    .directive('solTabs', solTabs)
    .directive('solPopmenu', solPopmenu)
    .directive('solInput', solInput);
