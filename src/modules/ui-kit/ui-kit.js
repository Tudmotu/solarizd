import 'angular';
import solTabs from './sol-tabs/sol-tabs.js';
import solInput from './sol-input/sol-input.js';

export default angular.module('ui-kit', [])
    .directive('solTabs', solTabs)
    .directive('solInput', solInput);
