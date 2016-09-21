import './directives/sol-vibrate';
import './directives/sol-slide-rm';
import './directives/sol-scroll2top';
import '../modules/sol-backend/sol-backend';
import './Services';
import 'angular';
import 'jquery-ui/ui/scroll-parent';
import 'jquery-ui/ui/data';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/mouse';
import 'jquery-ui/ui/widgets/sortable';
import 'angular-ui-sortable';
import MobileDetect from 'mobile-detect';

const _md = new MobileDetect(window.navigator.userAgent);
const isMobile = _md.mobile() !== null;

function mouseCoords(event) {
    var totalOffsetX = 0,
        totalOffsetY = 0,
        canvasX = 0,
        canvasY = 0,
        currentElement = event.target;

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        currentElement = currentElement.offsetParent;
    }
    while (currentElement);

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {
        x: canvasX,
        y: canvasY
    };
}

export default angular.module('ui.playlist',
    ['sol-backend', 'services', 'filters', 'ui.sortable', 'solVibrate', 'solSlideRm', 'solScroll2top'])
    .directive('playlistPane', [
            '$rootScope', '$http', '$location', 'youtubeAPI', 'playList', 'solBackend', 'lastfm',
            function($rootScope, $http, $location, youtubeAPI, playList, solBackend, lastfm) {
        var definitions = {
            restrict: 'E',
            templateUrl: '/html/playlist/pane.html',
            replace: true,
            scope: true,
            link: function($scope, $element, $attrs) {
                var media = window.matchMedia('(max-width:1280px),(max-device-width:1280px)');

                $scope.duration = 0;
                $scope.progress = 0;

                if (media.matches) {
                    $scope.ready = true;
                } else {
                    $rootScope.$on('searchPane:loaded', function() {
                        $scope.ready = true;
                        if (!$scope.$$phase) $scope.$digest();
                    });
                }

                solBackend.onAuth((authData) => {
                    $scope.authData = authData;
                });

                $scope.publishPlaylist = () => {
                    playList.publishPlaylist().then((refKey) => {
                        let url = `${window.location.origin}/#playlist=${refKey}`;
                        $rootScope.$broadcast('app::confirm', {
                            title: 'Share URL',
                            confirmOnly: true,
                            html: `A link to this playlist has been created:
                                    <br/>
                                    <a href="${url}" target="_blank">${url}</a>`
                        });
                    });
                };

                $scope.$watch(() => playList.isShuffled(), (newVal) => {
                    $scope.shuffled = newVal;
                });
                $scope.toggleShuffle = () => {
                    playList.toggleShuffle();
                };

                $scope.clearPlaylist = function() {
                    $rootScope.$broadcast('app::confirm', {
                        title: 'Clear Playlist',
                        text: 'You are about to clear your entire playlist. Are you sure?',
                        onConfirm: () => {
                            playList.clearList();
                            $location.search('playlist', null);
                        }
                    });
                };

                $scope.isItemActive = (idx) => {
                    let state = playList.getState();
                    let playing = state === playList.st.PLAYING;
                    let active = playing && $scope.getItemProgress(idx) > 0;
                    return active || undefined;
                };

                $scope.getItemProgress = (idx) => {
                    let progress = $scope.progress;

                    if ($scope.nowPlayingIdx === idx)
                        return progress;
                };

                $scope.itemMatch = function(item, query) {
                    var matches;
                    if (!query) return true;

                    matches = item.snippet
                        .title.toLowerCase()
                        .indexOf(query.toLowerCase()) >= 0;

                    return matches || undefined;
                };

                $scope.$on('actions-toggled', (e, value) => {
                    if (value === true) {
                        let target = e.targetScope;
                        let idx = target.idx;

                        $scope.items.forEach((item, i) => {
                            if (i === idx) return;
                            item.actionsOpen = false;
                        });
                    }
                });

                let backgroundSet = false;

                Object.assign($scope, {
                    searchFocused: false,

                    getCurrentlyOpenIdx: () => {
                        let idx = null;

                        $scope.items.some((item, i) => {
                            if (item.actionsOpen) {
                                idx = i;
                                return true;
                            }
                        });

                        return idx;
                    },
                    changeBackground () {
                        let nowPlayingIdx = playList.getNowPlayingIdx();
                        let nowPlaying = playList.getNowPlaying();
                        backgroundSet = false;

                        if (nowPlaying) {
                            lastfm.getTrackImage(
                                nowPlaying.snippet.title
                            ).then(src => {
                                if (!backgroundSet) {
                                    $scope.backgroundImg = src;
                                    backgroundSet = true;
                                }
                            });
                        }
                        else $scope.backgroundImg = '';
                    },
                    focusSearch () {
                        this.searchFocused = true;
                        let notInState = !history.state || !history.state.playlistSearch;

                        if (isMobile && notInState) {
                            history.pushState({ playlistSearch: true }, '');
                        }
                    }
                });

                window.addEventListener('popstate', (e) => {
                    if (e.state && e.state.playlistSearch) {
                        $scope.searchFocused = true;
                        $scope.$digest();
                    }
                    else {
                        $scope.searchFocused = false;
                        $scope.query = '';
                        $scope.$digest();
                    }
                });

                $scope.$watch(playList.getNowPlayingIdx,
                    val => {
                        $scope.nowPlayingIdx = val;
                        $scope.progress = 0;
                        $scope.changeBackground();
                    });

                $scope.$watch(playList.getDuration,
                    val => $scope.duration = val);

                $scope.$watch(playList.getProgress,
                    val => $scope.progress = val);

                $scope.sortableOpts = {
                    axis: 'y',
                    handle: '.mover',
                    start: function(e, ui) {
                        $rootScope.$broadcast('closeTrackActions');
                        $scope.currentlyDragging = true;
                        if (!$scope.$$phase) $scope.$digest();
                    },
                    stop: function(e, ui) {
                        // Fix the playlist's currently playing track
                        var fromIdx = ui.item.sortable.index,
                            toIdx = ui.item.sortable.dropindex,
                            nowPlaying = playList.getNowPlayingIdx();

                        if (typeof nowPlaying === 'number') {
                            if (fromIdx < nowPlaying &&
                                toIdx >= nowPlaying) {
                                playList.setNowPlaying(nowPlaying - 1);
                            } else if (fromIdx > nowPlaying &&
                                toIdx <= nowPlaying) {
                                playList.setNowPlaying(nowPlaying + 1);
                            } else if (fromIdx === nowPlaying) {
                                playList.setNowPlaying(toIdx);
                            }
                        }

                        playList.save();
                        $scope.currentlyDragging = false;
                        if (!$scope.$$phase) $scope.$digest();
                    }
                };
            },
            controller: function($scope, $element, $attrs, $transclude) {
                $scope.items = playList.playlist;
                $scope.$watch(() => playList.metadata, (newVal, oldVal) => {
                    if (!!newVal) {
                        newVal.$bindTo($scope, "metadata");
                    }
                    else {
                        $scope.metadata = null;
                    }

                    if (oldVal) {
                        oldVal.$destroy();
                    }
                });
                $scope.savePlaylist = function() {
                    playList.save();
                };
            }
        };

        return definitions;
    }]).directive('playlistProgress', ['$rootScope', 'youtubePlayer', function($rootScope, youtubePlayer) {
        var definitions = {
            restrict: 'E',
            templateUrl: '/html/playlist/progress.html',
            replace: true,
            scope: {
                progress: '=',
                duration: '@'
            },
            link: function($scope, $element, $attrs) {
                $element.on('click', function(e) {
                    var coords, time;

                    if (e.target.classList.contains('progress')) {
                        coords = mouseCoords(e);
                        time = $scope.duration * (coords.x / e.target.clientWidth);

                        youtubePlayer.seek(time);
                    }
                });
            }
        };

        return definitions;
    }]);
