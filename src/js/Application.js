import 'babel-core/polyfill';
import '../plugins/plugins';
import './Footer';
import './Topbar';
import './Search';
import './Playlist';
import './MediaPanel';
import '../modules/ui-kit/ui-kit';
import 'ng-resource';
import 'angular';

export default angular.module('Application', [
    'ngResource',
    'ui.footer',
    'ui.topbar',
    'ui.search',
    'ui.media-panel',
    'ui.playlist',
    'ui-kit',
    'services'
]).directive('solarizdApp', ['ApiKey', 'playList', function(ApiKey, playList) {
    return {
        restrict: 'E',
        templateUrl: '/html/app.html',
        replace: true,
        scope: true,
        link: function($scope, $element) {
            $scope.defaultTab = 0;
            if (playList.playlist.length) {
                $scope.defaultTab = 1;
            }

            ApiKey.fetchKeys().then(function() {
                $element[0].classList.add('loaded');
            });
        }
    };
}]);
