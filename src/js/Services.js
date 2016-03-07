import Apikey from './services/apikey';
import EchoNest from './services/echo-nest';
import lastfm from './services/last-fm';
import Playlist from './services/playlist';
import PlaylistVolume from './services/playlistVolume';
import YoutubeAPI from './services/youtube-api';
import YoutubePlayer from './services/youtube-player';
import 'angular';
export default angular.module('services', ['sol-backend', 'api-key'])
    .service('echoNestAPI', EchoNest)
    .service('lastfm', lastfm)
    .service('youtubeAPI', YoutubeAPI)
    .service('youtubePlayer', YoutubePlayer)
    .service('playListVolume', PlaylistVolume)
    .service('playList', Playlist);
