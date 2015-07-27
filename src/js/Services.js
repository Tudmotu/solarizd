define([
    './services/apikey',
    './services/echo-nest',
    './services/playlist',
    './services/playlistVolume',
    './services/youtube-api',
    './services/youtube-player',
    '../vendor/angular/angular'
], function (Apikey, EchoNest, Playlist, PlaylistVolume, YoutubeAPI, YoutubePlayer) {
    return angular.module('services', [])
                    .constant('ApiKeysConf', {
                        services: ['youtube', 'soundcloud', 'echonest']
                    })
                    .service('ApiKey'        , Apikey)
                    .service('echoNestAPI'   , EchoNest)
                    .service('youtubeAPI'    , YoutubeAPI)
                    .service('youtubePlayer' , YoutubePlayer)
                    .service('playListVolume', PlaylistVolume)
                    .service('playList'      , Playlist);
});
