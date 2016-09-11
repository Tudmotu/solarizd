import MobileDetect from 'mobile-detect';

export default ['$sce', '$q', '$rootScope', function($sce, $q, $rootScope) {
    var that = this,
        playerDfrd = $q.defer(),
        playerReady = playerDfrd.promise,
        apiReady = $q.defer(),
        player = null,
        _md = new MobileDetect(window.navigator.userAgent),
        isMobile = _md.mobile() !== null,
        playedOnce = false,
        elId;

    let connectedToPeerHost = false;

    this.nowPlaying = {
        id: null,
        title: null,
        src: null
    };
    this.onStateChange = null;
    this.playerState = null;
    this.ready = false;
    this.playerInfo = null;
    this.apiReady = apiReady.promise;

    function initPlayer() {
        if (typeof elId === 'string' && player === null) {
            player = new YT.Player(elId, {
                playerVars: {
                    enablejsapi: 1,
                    origin: encodeURIComponent(document.location.origin)
                },
                events: {
                    onError: function(e) {
                        console.debug('ERROR', e);
                    },
                    onReady: function(e) {
                        apiReady.resolve();
                        that.ready = true;
                    },
                    onStateChange: function(e) {}
                }
            });
            window.addEventListener('message', function(e) {
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
            window.onbeforeunload = function(e) {
                if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                    e.preventDefault();
                    return 'A song is currently playing.';
                }
            };
        }
        window.onYouTubeIframeAPIReady = null;
    }

    this.init = function() {
        var apiUrl = 'https://www.youtube.com/iframe_api';
        var script = document.createElement('script');

        window.onYouTubeIframeAPIReady = initPlayer;

        script.type = 'text/javascript';
        script.async = true;
        script.src = apiUrl;
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    this.setElement = function(el) {
        elId = el;
    };

    this.play = function() {
        if (connectedToPeerHost) return;
        if (!player) return;
        if (!isMobile || playedOnce) {
            player.playVideo();
        }
    };

    this.pause = function() {
        if (connectedToPeerHost) return;
        if (!player) return;
        player.pauseVideo();
    };

    this.stop = function() {
        if (connectedToPeerHost) return;
        if (!player) return;
        player.stopVideo();
    };

    this.loadVideo = function(vid) {
        this.nowPlaying.id = vid;
        playerDfrd = $q.defer();
        playerReady = playerDfrd.promise;

        if (!this.ready) this.init();

        return this.apiReady.then(() => {
            player.loadVideoById(vid);

            if (isMobile && !playedOnce) {
                $rootScope.$broadcast('youtubePlayer:videoCued', vid);
            }
        });
    };

    this.cueVideo = (videoId, startSeconds = 0) => {
        if (!this.ready) this.init();
        if (this.nowPlaying.id === videoId &&
            player.getPlayerState() === YT.PlayerState.CUED) return;

        return this.apiReady.then(() => {
            player.cueVideoById({ videoId, startSeconds });
            this.nowPlaying.id = videoId;
        });
    };

    this.seek = function(sec) {
        if (!player) return;

        if (!this.connectedToHost()) {
            player.seekTo(sec, true);
        }
        else {
            $rootScope.$broadcast('peer::send_action_to_server', {
                type: 'seekTo',
                value: sec
            });
        }
    };

    this.toggleMute = function() {
        if (connectedToPeerHost) return;
        if (player) {
            if (player.isMuted()) player.unMute();
            else player.mute();
        }
    };

    this.mute = function() {
        if (connectedToPeerHost) return;
        if (player)
            player.mute();
    };
    this.unmute = function() {
        if (connectedToPeerHost) return;
        if (player)
            player.unMute();
    };
    this.isMuted = function() {
        if (connectedToPeerHost) return;
        if (player)
            player.isMuted();
    };
    this.setVolume = function(val) {
        if (connectedToPeerHost) return;
        if (player)
            player.setVolume(val);
    };
    this.getVolume = function() {
        if (player)
            player.getVolume();
    };

    this.connectedToHost = () => connectedToPeerHost;

    $rootScope.$on('peer::got_action_from_client', (e, action) => {
        switch (action.type) {
            case 'seekTo':
                player.seekTo(action.value, true);
                break;
        }
    });

    $rootScope.$on('peer::got_data_from_server', (e, data) => {
        let { playlist, nowPlaying } = data;

        if (typeof nowPlaying === 'number') {
            let videoId = playlist[nowPlaying].id;

            this.cueVideo(videoId, data.currentProgress);
        }
    });

    $rootScope.$on('peer::connected_to_server', () => {
        this.stop();
        connectedToPeerHost = true;
    });
    $rootScope.$on('peer::disconnected_from_server', () => {
        connectedToPeerHost = false;
        this.pause();
    });
}];

