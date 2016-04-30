import deepEqual from 'deep-equal';
import '../../modules/sol-backend/sol-backend';

var hasLS = !!window.localStorage;

export default [
    '$q',
    '$timeout',
    '$location',
    'youtubePlayer',
    'youtubeAPI',
    'playListVolume',
    'solBackend',
    '$rootScope',
    function(
        $q,
        $timeout,
        $location,
        ytPlayer,
        ytAPI,
        playListVolume,
        solBackend,
        $rootScope
    ) {
    var nowPlaying = null,
        st = {
            UNKNOWN: -1,
            INITIAL: 0,
            PLAYING: 1,
            PAUSING: 2,
            STOPPED: 3,
            BUFFERING: 4
        },
        state = st.INITIAL,
        currentTime = 0,
        currentDuration = 0,
        that = this;
    let isShuffled = false;

    this.st = st;
    this.playlist = [];

    $rootScope.$on('$locationChangeSuccess', (e, newUrl) => {
        getSavedList().then((list) => {
            //that.clearList();
            that.setPlaylist(list);
        });
    });

    this.setPlaylist = list => {
        this.playlist.length = 0;
        list.forEach(item => this.playlist.push(item));
    };

    $rootScope.$on('youtubePlayer:infoDelivery', function(e, data) {
        $timeout(() => {
            if (data.info.currentTime)
                currentTime = data.info.currentTime;

            if (data.info.duration)
                currentDuration = data.info.duration;

            syncClients();
        });
    });

    $rootScope.$on('youtubePlayer:onStateChange', function(e, data) {
        var currentItem,
            stopAt,
            playNext;
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
            currentItem = that.getNowPlaying();
            stopAt = getStopAt();
            playNext = getPlayNext();

            if (currentItem.repeatTrack)
                that.play(nowPlaying);

            else if (typeof playNext === 'number') {
                that.play(playNext);
                that.playlist[playNext].playNext = false;
            } else if (stopAt === nowPlaying) {
                setNowPlaying(null);
                currentItem.stopHere = false;
            } else if (that.hasNext())
                that.next();

            else
                setNowPlaying(null);
        }
        if (data.info === YT.PlayerState.BUFFERING) {
            state = st.BUFFERING;
        }
        $rootScope.$broadcast('playList:stateChanged', state);
        syncClients();
    });

    // Register keyboard sortcuts
    document.addEventListener('keyup', function(e) {
        var actions = {
            // Space
            32: function() {
                that.togglePlay();
            },
            // Left Arrow
            37: function() {
                var seekTo = currentTime - 5 >= 0 ?
                    currentTime - 5 :
                    0;
                ytPlayer.seek(seekTo);
            },
            // Right Arrow
            39: function() {
                ytPlayer.seek(currentTime + 5);
            }
        };

        if (e.target.tagName.toLowerCase() !== 'input' &&
            actions.hasOwnProperty(e.keyCode)) {
            e.preventDefault();
            actions[e.keyCode]();
        }
    });

    function getSavedList() {
        return $q((resolve, reject) => {
            let hash = window.location.hash;
            let hashMatches = hash.match(/#.*?&?playlist=(.*)&?/);
            let locationSearch = $location.search();
            let playlistId = locationSearch.playlist;

            if (hashMatches !== null)
                playlistId = hashMatches[1];

            if (!playlistId)
                reject();
            else
                resolve(playlistId);
        }).then((playlistId) => {
            solBackend.fetchPlaylistMetadata(playlistId).then((playlistRef) => {
                that.metadata = playlistRef;
            });
            return solBackend.getPlaylistData(playlistId);
        }).catch(() => {
            let list = [];
            let lsVal;
            that.metadata = null;

            if (hasLS) {
                lsVal = localStorage.playlist;
                if (lsVal) list = JSON.parse(lsVal);
            }

            return list;
        });
    }

    function setNowPlaying(idx) {
        var endingSound;
        if (nowPlaying === idx) return;

        if (typeof idx === 'number')
            nowPlaying = idx;
        else if (idx === null) {
            nowPlaying = null;
            $rootScope.$broadcast('toast::notify', {
                text: 'The playlist has ended.'
            });
            endingSound = new Audio('js/assets/indian-bell-chime.wav');
            endingSound.volume = playListVolume.get() / 100;
            endingSound.play();
        }

        syncClients();
    }

    function getPlayNext() {
        var idx;
        that.playlist.forEach(function(item, i) {
            if (item.playNext)
                idx = i;
        });
        return idx;
    }

    function getStopAt() {
        var idx;
        that.playlist.forEach(function(item, i) {
            if (item.stopHere)
                idx = i;
        });
        return idx;
    }

    this.saveList = function(name) {
        if (hasLS) {
            if (typeof name !== 'string')
                name = 'playlist';
            localStorage[name] = JSON.stringify(that.playlist);
        }
        syncClients();
    };

    this.clearList = function() {
        if (state !== st.INITIAL) this.stop();

        this.playlist.length = 0;
        this.saveList();
    };

    function formatItem (item) {
        let newItem = {
            contentDetails: {
                duration: item.contentDetails.duration
            },
            id: item.id,
            snippet: {
                thumbnails: {
                    default: item.snippet.thumbnails.default
                },
                title: item.snippet.title
            }
        };

        return newItem;
    }

    this.addItem = function(idx, item) {
        item = formatItem(item);
        that.playlist.splice(idx, 0, item);
        this.saveList();
    };

    this.removeItem = function(idx) {
        that.playlist.splice(idx, 1);

        // Fix the 'nowPlaying' var, if necessary
        if (idx < nowPlaying) {
            nowPlaying -= 1;
        }

        this.saveList();
    };

    this.getState = function() {
        return state;
    };

    this.save = function() {
        this.saveList();
    };

    this.setNowPlaying = function(idx) {
        return setNowPlaying(idx);
    };

    this.getNowPlaying = function() {
        return that.playlist[nowPlaying];
    };

    this.getNowPlayingIdx = function() {
        return nowPlaying;
    };

    this.add = function(videoId, idx) {
        var that = this;

        return ytAPI.getVideo(videoId).then(function(resp) {
            var item = resp.data.items[0],
                thumb = item.snippet.thumbnails.default.url,
                title = item.snippet.title,
                trimmed = title.length >= 30 ? title.substr(0, 27) + '...' :
                title,
                text = 'Track "' + trimmed + '" has been added to playlist';

            that.addItem(idx, item);
            if (that.playlist.length === 1 ||
                (idx === that.playlist.length - 1 && state === st.STOPPED))
                that.play(idx);

            $rootScope.$broadcast('toast::notify', {
                thumb: thumb,
                text: text
            });
        });
    };

    this.addFirst = function(videoId) {
        this.add(videoId, 0);
    };

    this.addLast = function(videoId) {
        this.add(videoId, this.playlist.length);
    };

    this.addBulk = items => {
        Promise.all(
            items.map(vid =>
                ytAPI.getVideo(vid.id).then(resp =>
                      resp.data.items[0]))
        ).then(videos => {
            videos.forEach(item => {
                $timeout(() => {
                    this.addItem(this.playlist.length, item);
                });
            });
        });
    };

    this.remove = function(idx) {
        var fixPlay = (idx === nowPlaying),
            isLast = (idx === this.playlist.length - 1);
        this.removeItem(idx);

        if (fixPlay) {
            if (isLast) {
                this.stop();
            } else {
                this.play(idx, true);
            }
        } else
            this.play();
    };

    this.togglePlay = function() {
        if (state === st.PLAYING) this.pause();
        else this.play();
    };

    this.play = function(index, force) {
        var idx = typeof index === 'number' ? index : (nowPlaying || 0),
            videoId = this.playlist[idx].id;


        if (idx === nowPlaying && !force) {
            sendActionToServer({
                type: 'play'
            });

            return ytPlayer.play();
        } else {
            return ytPlayer.loadVideo(videoId).then(function() {
                ytPlayer.play();
                setNowPlaying(idx);

                sendActionToServer({
                    type: 'playByIndex',
                    index: nowPlaying
                });
            });
        }
    };

    this.pause = function() {
        ytPlayer.pause();

        sendActionToServer({
            type: 'pause'
        });
    };

    this.stop = function() {
        ytPlayer.seek(0);
        ytPlayer.stop();
        setNowPlaying(null);

        sendActionToServer({
            type: 'stop'
        });
    };

    this.next = function() {
        if (isShuffled) {
            let nextIdx = Math.floor(Math.random() * this.playlist.length);
            this.play(nextIdx);
        }
        else if (this.hasNext())
            this.play(nowPlaying + 1);
    };

    this.hasNext = function() {
        return nowPlaying < this.playlist.length - 1;
    };

    this.prev = function() {
        if (nowPlaying !== 0)
            this.play(nowPlaying - 1);
    };

    this.playNext = function(idx) {
        var that = this;
        that.playlist.forEach(function(item) {
            item.playNext = false;
        });
        if (typeof idx === 'number')
            that.playlist[idx].playNext = true;

        this.saveList();
    };

    this.stopAt = function(idx) {
        var that = this;
        that.playlist.forEach(function(item) {
            item.stopHere = false;
        });
        if (typeof idx === 'number')
            that.playlist[idx].stopHere = true;

        this.saveList();
    };

    this.repeatTrack = function(idx) {
        var that = this;
        that.playlist.forEach(function(item) {
            item.repeatTrack = false;
        });
        if (typeof idx === 'number')
            that.playlist[idx].repeatTrack = true;

        this.saveList();
    };

    this.publishPlaylist = function () {
        return solBackend.publishPlaylist(this.playlist).then((refKey) => {
            return refKey;
        }).catch(() => {});
    };

    this.getProgress = () => {
        return currentTime;
    };

    this.getDuration = () => {
        return currentDuration;
    };

    this.toggleShuffle = () => {
        isShuffled = !isShuffled;
    };

    this.isShuffled = () => {
        return isShuffled;
    };

    $rootScope.$watchCollection(() => this.playlist, (newVal, oldVal) => {
        if (!deepEqual(newVal, oldVal)) {
            sendActionToServer({
                type: 'setPlaylist',
                playlist: newVal
            });
        }
    });

    function syncClients () {
        $rootScope.$broadcast('peer::sync_clients');
    }

    function sendActionToServer (action) {
        $rootScope.$broadcast('peer::send_action_to_server', action);
    }

    $rootScope.$on('peer::got_action_from_client', (e, action) => {
        $rootScope.$apply(() => {
            switch (action.type) {
                case 'play':
                    this.play();
                    break;
                case 'playByIndex':
                    this.play(action.index);
                    break;
                case 'pause':
                    this.pause();
                    break;
                case 'stop':
                    this.stop();
                    break;
                case 'setPlaylist':
                    this.setPlaylist(action.playlist);
                    break;
            }
        });
    });

    $rootScope.$on('peer::got_data_from_server', (e, data) => {
        $rootScope.$apply(() => {
            this.setPlaylist(data.playlist);
            this.setNowPlaying(data.nowPlaying);
            state = data.playlistState;
            currentTime = data.currentProgress;
            currentDuration = data.currentDuration;
        });
    });
}];
