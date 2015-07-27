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
        ]).run([
            '$rootScope', 
            'ApiKey',
            'youtubeAPI',
            'echoNestAPI',
            function ($rootScope, ApiKey) {
            ApiKey.fetchKeys().then(function () {
                document.body.classList.remove('loading');
            });
        }]);
});
