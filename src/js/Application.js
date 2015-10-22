import 'babel-core/polyfill';
import '../plugins/plugins';
import './Footer';
import './Topbar';
import './Search';
import './Playlist';
import './MediaPanel';
import '../modules/ui-kit/ui-kit';
import '../modules/playlist/playlist';
import '../modules/notifications/notifications';
import '../modules/user-playlists/user-playlists';
import 'ng-resource';
import 'angular';

const cacheUpdated = new Promise((resolve, reject) => {
    if (window.hasOwnProperty('applicationCache')) {
        window.applicationCache.addEventListener('updateready', function() {
            resolve();
        });
    }
});

export default angular.module('Application', [
    'ngResource',
    'ui.footer',
    'ui.topbar',
    'ui.search',
    'ui.media-panel',
    'ui.playlist',
    'ui-kit',
    'notifications',
    'user-playlists',
    'playlist',
    'services',
    'plugins'
]).directive('solarizdApp', ['$rootScope', 'ApiKey', 'playList', function($rootScope, ApiKey, playList) {
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

            // Notify users when there's a new version
            cacheUpdated.then(() => {
                $rootScope.$broadcast('toast::notify', {
                    text: 'Reload this app to get a newer version',
                    persist: true
                });
            });
        }
    };
}]);
