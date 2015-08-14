import './Footer';
import './Topbar';
import './Search';
import './Playlist';
import './MediaPanel';
import './PanelSwitcher';
import '../modules/ui-kit/ui-kit';
import 'angular';

export default angular.module('Application', [
    'ngResource',
    'ui.footer',
    'ui.topbar',
    'ui.search',
    'ui.media-panel',
    'ui.panel-switcher',
    'ui.playlist',
    'ui-kit',
    'services'
]).directive('solarizdApp', ['ApiKey', function(ApiKey) {
    return {
        restrict: 'E',
        templateUrl: '/html/app.html',
        replace: true,
        scope: true,
        link: function($scope, $element) {
            ApiKey.fetchKeys().then(function() {
                $element[0].classList.add('loaded');
            });
        }
    };
}]);
