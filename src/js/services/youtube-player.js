define([
    'vendor/mobile-detect/mobile-detect',
    'angular'
], function () {
    return ['$sce', '$q', '$rootScope', function ($sce, $q, $rootScope) {
        var that         = this,
            playerDfrd   = $q.defer(),
            playerReady  = playerDfrd.promise,
            apiReady     = $q.defer(),
            player       = null,
            _md = new MobileDetect(window.navigator.userAgent),
            isMobile = _md.mobile() !== null,
            playedOnce = false,
            elId;

        this.nowPlaying     = {
            id    : null,
            title : null,
            src   : null
        };
        this.onStateChange  = null;
        this.playerState    = null;
        this.ready          = false;
        this.playerInfo     = null;
        this.apiReady       = apiReady.promise;

        function initPlayer () {
            if (typeof elId === 'string' && player === null) {
                player = new YT.Player(elId, {
                    playerVars: {
                        enablejsapi: 1,
                        origin: encodeURIComponent(document.location.origin)
                    },
                    events: {
                        onError: function (e) {
                            console.debug('ERROR', e);
                        },
                        onReady: function (e) {
                            apiReady.resolve();
                            this.ready = true;
                        },
                        onStateChange: function (e) {}
                    }
                });
                window.addEventListener('message', function (e) {
                    var data = JSON.parse(e.data);

                    if (data.event === 'initialDelivery') {
                        playerDfrd.resolve();
                        that.playerInfo = e.info;
                    }
                    if (data.event === 'onStateChange' &&
                        data.info === YT.PlayerState.PLAYING) {
                        playedOnce = true;
                    }
                    $rootScope.$broadcast('youtubePlayer:' + data.event, data);
                    //console.debug('MESSAGE', data);
                });

                // Display warning if leaving app while song is playing
                window.onbeforeunload = function (e) {
                    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                        e.preventDefault();
                        return 'A song is currently playing.';
                    }
                };
            }
            onYouTubeIframeAPIReady = null;
        }

        this.init = function () {
            require(['https://www.youtube.com/iframe_api']);
            onYouTubeIframeAPIReady = initPlayer;
        };

        this.setElement = function (el) {
            elId = el;
        };

        this.play = function () {
            if (!isMobile || playedOnce) {
                player.playVideo();
            }
        };

        this.pause = function () {
            player.pauseVideo();
        };

        this.stop = function () {
            player.stopVideo();
        };

        this.clear = function () {
            // FIXME: Doesn't seem to really work... =\
            player.clearVideo();
        };

        this.loadVideo = function (vid) {
            this.nowPlaying.id = vid;
            playerDfrd = $q.defer();
            playerReady = playerDfrd.promise;

            if (!this.ready) this.init();

            return this.apiReady.then(function () {
                if (!isMobile || playedOnce) {
                    player.loadVideoById(vid);
                }
                else {
                    player.cueVideoById(vid);
                    $rootScope.$broadcast('youtubePlayer:videoCued', vid);
                }
            });
        };

        this.seek = function (sec) {
            player.seekTo(sec, true);
        };

        this.toggleMute = function () {
            if (player) {
                if (player.isMuted()) player.unMute();
                else player.mute();
            }
        };

        this.mute = function () {
            player.mute();
        };
        this.unmute = function () {
            player.unMute();
        };
        this.isMuted = function () {
            player.isMuted();
        };
        this.setVolume = function (val) {
            player.setVolume(val);
        };
        this.getVolume = function () {
            player.getVolume();
        };
    }];
});

