define([
    'vendor/mobile-detect/mobile-detect',
    'angular'
], function () {
    var hasLS = !!window.localStorage;

    return angular.module('services', [])
    .constant('ApiKeysConf', {
        services: ['youtube', 'soundcloud', 'echonest']
    })
    .service('ApiKey', ['$rootScope', '$http', 'ApiKeysConf', function ($rootScope, $http, Conf) {
        var KEYS = {};

        this.set = function (service, key) {
            if (Conf.services.indexOf(service) >= 0) {
                KEYS[service] = key;
            }
        };

        this.get = function (service) {
            if (Conf.services.indexOf(service) >= 0) {
                return KEYS[service];
            }
        };

        this.fetchKeys = function () {
            var that = this;
            return $http.get('apikeys.json').then(function (resp) {
                var data = resp.data;
                Object.keys(data).forEach(function (service) {
                    var key = data[service];
                    that.set(service, key);
                    $rootScope.$emit(service + '-apikey', key);
                });
            });
        };
    }])
    .constant('echoNestConf', {
        baseUrl: 'http://developer.echonest.com/api/v4/:type/:method'
    })
    .service('echoNestAPI', ['$rootScope', '$http', '$q', 'echoNestConf', function ($rootScope, $http, $q, echoNestConf) {
        var APIKEY = null;
        $rootScope.$on('echonest-apikey', function (e, key) { APIKEY = key; });

        this.fetch = function (type, method, args) {
            var url = echoNestConf.baseUrl
                        .replace(':type', type)
                        .replace(':method', method);
            var rejectedPromise = $q.defer();
            if (!APIKEY) { rejectedPromise.reject(); return rejectedPromise.promise; }

            args.results = 25;
            args.api_key = APIKEY;
            return $http.get(url, { params: args });
        };

        this.fetchSongByCombined = function (combinedTitle) {
            return this.fetch('song', 'search', {
                combined: combinedTitle
            });
        };
    }])
    .service('lyricsAPI', ['$rootScope', '$http', '$q', 'echoNestAPI', function ($rootScope, $http, $q, echoNest) {
        this.fetch = function (title, artist) {
            var dfrd = $q.defer();

            $http.get('/lyrics/', { params: {
                artist: artist,
                song: title
            } }).then(function (resp) {
                dfrd.resolve({
                    artist: artist,
                    songName: title,
                    lyrics: resp.data.lyrics,
                    url: resp.data.url
                });
            }, function () {
                dfrd.reject({
                    artist: artist,
                    songName: title
                });
            });

            return dfrd.promise;
        };

        this.fetchByTitle = function (title) {
            var dfrd = $q.defer(),
                that = this;

            echoNest.fetchSongByCombined(title).then(function (resp) {
                var data = resp.data.response;

                if (data.status.code === 0) {
                    var song = data.songs.reduce(function (prev, song, i, arr) {
                        if (!prev) {
                            if (title.match(song.artist_name)) return song;
                            if (title.match(song.title)) return song;
                        }
                        else if (song.title !== song.artist_name &&
                                title.indexOf(song.title) >= 0 &&
                                title.indexOf(song.artist_name) >= 0) {
                                return song;
                        }
                        return prev;
                    }, null);

                    if (!song) dfrd.reject();
                    else that.fetch(song.title, song.artist_name)
                        .then(dfrd.resolve, dfrd.reject);
                }
                else {
                    dfrd.reject(data.status);
                }
            }, function (err) {
                dfrd.reject(err);
            });

            return dfrd.promise;
        };

    }])
    .constant('youtubeConf', {
        basePath: 'https://www.googleapis.com/youtube/v3',
        maxResults: 50,
        messages: {
            NO_APIKEY: 'No YouTube API-KEY was found. Cannot make requests to server.'
        }
    })
    .service('youtubeAPI', ['$rootScope', '$http', '$q', 'youtubeConf', function ($rootScope, $http, $q, Conf) {
        var APIKEY = null;
        $rootScope.$on('youtube-apikey', function (e, key) { APIKEY = key; });

        this.search = function (opts) {
            var that = this;
            var query;
            var path = Conf.basePath + '/search';
            var rejectedPromise = $q.defer();
            if (!APIKEY) { rejectedPromise.reject(); return rejectedPromise.promise; }

            if (typeof opts === 'string') {
                query = opts;
                opts = {};
                opts.q = query;
            }

            opts.maxResults = Conf.maxResults;
            opts.key = APIKEY;
            opts.part = 'snippet';
            opts.type = 'video';
            opts.videoCategoryId = 10;

            return $http.get(path, { params: opts }).then(function (list) {
                var videoIds = list.data.items.map(function (item) {
                    return item.id.videoId;
                });

                // Fetch durations and stuff
                return that.getVideo(videoIds);
            }).then(function (resp) {
                resp.data.items.forEach(function (item, i) {
                    item.duration = item.contentDetails.duration;
                });

                return resp.data.items;
            });
        };

        this.getVideo = function (videoId) {
            var path = Conf.basePath + '/videos',
                opts = {};
            var rejectedPromise = $q.defer();
            if (!APIKEY) { rejectedPromise.reject(); return rejectedPromise.promise; }


            opts.maxResults = Conf.maxResults;
            opts.part = 'snippet,statistics,contentDetails';
            opts.fields = 'items(id,snippet,contentDetails/duration,statistics/viewCount)';
            opts.key = APIKEY;
            opts.id = Array.isArray(videoId) ? videoId.join(',') : videoId;

            return $http.get(path, { params: opts });
        };

        this.getRelated = function (videoId) {
            var opts = {};
            opts.relatedToVideoId = videoId;
            opts.part = 'snippet';
            opts.type = 'video';
            opts.videoCategoryId = 10;

            return this.search(opts);
        };
    }])
    .constant('youtubeResource', {
        baseUrl: 'https://www.youtube.com/embed/{videoId}',
        //parameters: [
                        //'enablejsapi',
                        //['origin', encodeURIComponent(document.location.origin)]
                    //]
    })
    .service('youtubePlayer', ['$sce', '$q', 'youtubeResource', '$rootScope', function ($sce, $q, ytResource, $rootScope) {
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
    }])
    .service('playList', ['youtubePlayer', 'youtubeAPI', '$rootScope', function (ytPlayer, ytAPI, $rootScope) {
        var nowPlaying  = null,
            st          = {
                UNKNOWN: -1,
                INITIAL: 0,
                PLAYING: 1,
                PAUSING: 2,
                STOPPED: 3,
                BUFFERING: 4
            },
            state       = st.INITIAL,
            currentTime = 0,
            that        = this;

        this.playlist  = getSavedList();
        this.st        = st;

        $rootScope.$on('youtubePlayer:infoDelivery', function (e, data) {
            if (data.info.hasOwnProperty('currentTime')) {
                currentTime = data.info.currentTime;
            }
        });
        $rootScope.$on('youtubePlayer:onStateChange', function (e, data) {
            if (data.info === YT.PlayerState.PLAYING) {
                state = st.PLAYING;
                setNowPlaying(nowPlaying);
            }
            if (data.info === YT.PlayerState.PAUSED) {
                state = st.PAUSING;
                setNowPlaying(false);
            }
            if (data.info === YT.PlayerState.ENDED) {
                state = st.STOPPED;
                if (that.hasNext())
                    that.next();
                else
                    setNowPlaying(null);
            }
            if (data.info === YT.PlayerState.BUFFERING) {
                state = st.BUFFERING;
            }
            $rootScope.$broadcast('playList:stateChanged', state);
        });

        // Register keyboard sortcuts
        document.addEventListener('keyup', function (e) {
            var actions = {
                // Space
                32: function () {
                    that.togglePlay();
                },
                // Left Arrow
                37: function () {
                    var seekTo = currentTime - 5 >= 0 ?
                                    currentTime - 5 :
                                    0;
                    ytPlayer.seek(seekTo);
                },
                // Right Arrow
                39: function () {
                    ytPlayer.seek(currentTime + 5);
                }
            };

            if (e.target.tagName.toLowerCase() !== 'input' &&
                actions.hasOwnProperty(e.keyCode)) {
                e.preventDefault();
                actions[e.keyCode]();
            }
        });

        function getSavedList () {
            var list = [],
                lsVal;
            if (hasLS) {
                lsVal = localStorage.playlist;
                if (lsVal) list = JSON.parse(lsVal);
            }

            return list;
        }

        function saveList () {
            var lsVal;
            if (hasLS)
                localStorage.playlist = JSON.stringify(that.playlist);
        }

        function setNowPlaying (idx) {
            if (typeof idx === 'number')
                nowPlaying = idx;
            else if (idx === null)
                nowPlaying = null;
        }

        function addItem (idx, item) {
            that.playlist.splice(idx, 0, item);
            saveList();
        }

        function removeItem (idx) {
            that.playlist.splice(idx,1);

            // Fix the 'nowPlaying' var, if necessary
            if (idx < nowPlaying) {
                nowPlaying -= 1;
            }

            saveList();
        }

        this.getState = function () {
            return state;
        };

        this.save = function () {
            saveList();
        };

        this.setNowPlaying = function (idx) {
            return setNowPlaying(idx);
        };

        this.getNowPlaying = function () {
            return that.playlist[nowPlaying];
        };

        this.getNowPlayingIdx = function () {
            return nowPlaying;
        };

        this.add = function (videoId, idx) {
            var that = this;

            ytAPI.getVideo(videoId).then(function (resp) {
                var item = resp.data.items[0],
                    thumb = item.snippet.thumbnails.default.url,
                    title = item.snippet.title,
                    trimmed = title.length >= 30 ? title.substr(0,27) + '...' :
                                title,
                    text = 'Track "' + trimmed + '" has been added to playlist';

                addItem(idx, item);
                if (that.playlist.length === 1 || 
                    (idx === that.playlist.length - 1 && state === st.STOPPED))
                        that.play(idx);

                $rootScope.$broadcast('notify', {
                    thumb: thumb,
                    text: text
                });
            });
        };

        this.addFirst = function (videoId) {
            this.add(videoId, 0);
        };

        this.addLast = function (videoId) {
            this.add(videoId, this.playlist.length);
        };

        this.remove = function (idx) {
            var fixPlay = (idx === nowPlaying),
                isLast  = (idx === this.playlist.length - 1);
            removeItem(idx);

            if (fixPlay) {
                if (isLast) {
                    this.stop();
                    this.clear();
                }
                else {
                    this.play(idx, true);
                }
            }
            else
                this.play();
        };

        this.togglePlay = function () {
            if (state === st.PLAYING) this.pause();
            else this.play();
        };

        this.play = function (index, force) {
            var idx = typeof index === 'number' ? index : (nowPlaying || 0),
                videoId = this.playlist[idx].id;

            if (idx === nowPlaying && !force) {
                return ytPlayer.play();
            }
            else {
                return ytPlayer.loadVideo(videoId).then(function () {
                    ytPlayer.play();
                    setNowPlaying(idx);
                });
            }
        };

        this.pause = function () {
            ytPlayer.pause();
            setNowPlaying(false);
        };

        this.stop = function () {
            ytPlayer.seek(0);
            ytPlayer.stop();
            setNowPlaying(null);
        };

        this.clear = function () {
            ytPlayer.clear();
        };

        this.next = function () {
            if (this.hasNext())
                this.play(nowPlaying + 1);
        };

        this.hasNext = function () {
            return nowPlaying < this.playlist.length - 1;
        };

        this.prev = function () {
            if (nowPlaying !== 0)
                this.play(nowPlaying - 1);
        };
    }]);
});
