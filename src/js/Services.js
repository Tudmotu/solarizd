define([
    './services/apikey',
    './services/echo-nest',
    './services/playlist',
    './services/youtube-api',
    './services/youtube-player',
    'angular'
], function (Apikey, EchoNest, Playlist, YoutubeAPI, YoutubePlayer) {
    return angular.module('services', [])
                    .constant('ApiKeysConf', {
                        services: ['youtube', 'soundcloud', 'echonest']
                    })
                    .service('ApiKey'        , Apikey)
                    .service('echoNestAPI'   , EchoNest)
                    .service('youtubeAPI'    , YoutubeAPI)
                    .service('youtubePlayer' , YoutubePlayer)
                    .service('playList'      , Playlist);
});
