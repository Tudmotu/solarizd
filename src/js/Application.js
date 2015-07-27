define([
    './Footer',
    './Topbar',
    './Search',
    './Playlist',
    './MediaPanel',
    './PanelSwitcher',
    '../vendor/angular/angular'
], function () {
    return angular.module('Application', [
        'ngResource', 
        'ui.footer', 
        'ui.topbar', 
        'ui.search', 
        'ui.media-panel', 
        'ui.panel-switcher', 
        'ui.playlist',
        'services'
        ]).directive('solarizdApp', ['ApiKey', function (ApiKey) {
            return {
                restrict: 'E',
                templateUrl: '/html/app.html',
                replace: true,
                scope: true,
                link: function ($scope, $element) {
                    ApiKey.fetchKeys().then(function () {
                        $element[0].classList.add('loaded');
                    });
                }
            };
        }]);
});
