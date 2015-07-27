define([
    './directives/sol-vibrate',
    './directives/sol-slide-rm',
    './directives/sol-scroll2top',
    '../vendor/angular-ui-sortable/sortable',
    './Services',
    '../vendor/angular/angular'
], function () {
    function mouseCoords (event) {
        var totalOffsetX = 0,
            totalOffsetY = 0,
            canvasX = 0,
            canvasY = 0,
            currentElement = event.target;

        do{
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

    return angular.module('ui.playlist', ['services', 'filters', 'ui.sortable', 'solVibrate', 'solSlideRm', 'solScroll2top'])
            .directive('playlistPane', ['$rootScope', '$http', 'youtubeAPI', 'playList', function ($rootScope, $http, youtubeAPI, playList) {
                var definitions = {
                        restrict: 'E',
                        templateUrl: '/html/playlist/pane.html',
                        replace: true,
                        scope: true,
                        link: function ($scope, $element, $attrs) {
                            var media = window.matchMedia('(max-width:1280px),(max-device-width:1280px)');

                            $scope.progress = 0;

                            if (media.matches) {
                                $scope.ready = true;
                            }
                            else {
                                $rootScope.$on('searchPane:loaded', function () {
                                    $scope.ready = true;
                                    if (!$scope.$$phase) $scope.$digest();
                                });
                            }

                            $scope.clearPlaylist = function () {
                                playList.clearList();
                            };

                            $scope.itemMatch = function (item, query) {
                                var matches;
                                if (!query) return true;

                                matches = item.snippet
                                    .title.toLowerCase()
                                    .indexOf(query.toLowerCase()) >= 0;

                                return matches || undefined;
                            };

                            if (playList.playlist.length) {
                                $rootScope.$broadcast('setCurrentView', 'playlist');
                            }

                            $rootScope.$on('playList:stateChanged', function (e, state) {
                                $scope.nowPlayingIdx = playList.getNowPlayingIdx();
                                if (!$scope.$$phase) $scope.$digest();
                            });

                            $rootScope.$on('closeTrackActions', function (e, idx) {
                                $scope.currentlyOpenIdx = null;
                            });

                            $rootScope.$on('itemActionsToggled', function (e, idx) {
                                $scope.currentlyOpenIdx = $scope.currentlyOpenIdx === idx ?
                                                            null :
                                                            idx;
                            });

                            $scope.sortableOpts = {
                                axis: 'y',
                                handle: '.mover',
                                start: function (e, ui) {
                                    $rootScope.$broadcast('closeTrackActions');
                                    $scope.currentlyDragging = true;
                                    if (!$scope.$$phase) $scope.$digest();
                                },
                                stop: function (e, ui) {
                                    // Fix the playlist's currently playing track
                                    var fromIdx     = ui.item.sortable.index,
                                        toIdx       = ui.item.sortable.dropindex,
                                        nowPlaying  = playList.getNowPlayingIdx();

                                    if (typeof nowPlaying === 'number') {
                                        if (fromIdx < nowPlaying &&
                                            toIdx >= nowPlaying) {
                                            playList.setNowPlaying(nowPlaying - 1);
                                        }
                                        else if (fromIdx > nowPlaying &&
                                            toIdx <= nowPlaying) {
                                            playList.setNowPlaying(nowPlaying + 1);
                                        }
                                        else if (fromIdx === nowPlaying) {
                                            playList.setNowPlaying(toIdx);
                                        }
                                    }

                                    playList.save();
                                    $scope.currentlyDragging = false;
                                    if (!$scope.$$phase) $scope.$digest();
                                }
                            };
                        },
                        controller: function ($scope, $element, $attrs, $transclude) {
                            $scope.items = playList.playlist;
                            $scope.savePlaylist = function () {
                                playList.save();
                            };
                        }
                    };

                return definitions;
            }]).directive('playlistProgress', ['$rootScope', 'youtubePlayer', function ($rootScope, youtubePlayer) {
                var definitions = {
                        restrict: 'E',
                        templateUrl: '/html/playlist/progress.html',
                        replace: true,
                        scope: {
                            progress: '=progress'
                        },
                        link: function ($scope, $element, $attrs) {
                            $element.on('click', function (e) {
                                var coords, time;

                                if (e.target.classList.contains('progress')) {
                                    coords = mouseCoords(e);
                                    time = $scope.duration * (coords.x / e.target.clientWidth);

                                    youtubePlayer.seek(time);
                                }
                            });
                        },
                        controller: function ($scope, $element, $attrs) {
                            $scope.duration = 0;
                            $scope.progress = 0;

                            $rootScope.$on('youtubePlayer:infoDelivery', function (e, data) {
                                if (data.info.duration)
                                    $scope.duration = data.info.duration;

                                if (data.info.currentTime)
                                    $scope.progress = data.info.currentTime;

                                if (!$scope.$$phase) $scope.$digest();
                            });
                        }
                    };

                return definitions;
            }]).directive('playlistItem', ['$rootScope', '$http', 'playList', function ($rootScope, $http, playList) {
                var definitions = {
                        restrict: 'E',
                        templateUrl: '/html/playlist/item.html',
                        replace: true,
                        scope: {
                            'videoId'     : '@videoId',
                            'title'       : '@title',
                            'thumbnail'   : '@thumbnail',
                            'autoplay'    : '@autoplay',
                            'nowPlaying'  : '=nowPlaying',
                            'playNext'    : '=playNext',
                            'stopHere'    : '=stopHere',
                            'repeatTrack' : '=repeatTrack',
                            'progress'    : '=progress',
                            'duration'    : '@duration',
                            'index'       : '@index'
                        },
                        controller: function ($scope, $element, $attrs, $transclude) {
                            $rootScope.$on('youtubePlayer:infoDelivery', function (e, state) {
                                $scope.nowPlaying = playList.getNowPlayingIdx() === $scope.getIndex();
                                $scope.isActive = ($scope.nowPlaying &&
                                    playList.getState() === playList.st.PLAYING);

                                if (!$scope.$$phase) $scope.$digest();
                            });
                            $rootScope.$on('playList:stateChanged', function (e, state) {
                                $scope.nowPlaying = playList.getNowPlayingIdx() === $scope.getIndex();
                                $scope.isActive = ($scope.nowPlaying && state === playList.st.PLAYING);
                                $scope.isBuffering = $scope.nowPlaying && [
                                    playList.st.PLAYING,
                                    playList.st.PAUSING,
                                    playList.st.STOPPED
                                ].indexOf(state) < 0;

                                // Scroll element into view if it is currently
                                // playing
                                if ($scope.getIndex() === playList.getNowPlayingIdx())
                                    $element[0].scrollIntoView();

                                if (!$scope.$$phase) $scope.$digest();
                            });

                            $scope.getIndex = function () {
                                return parseInt($scope.index, 10);
                            };

                            $scope.pause = function () {
                                playList.pause();
                            };

                            $scope.togglePlay = function () {
                                if ($scope.isActive)
                                    playList.pause();
                                else
                                    playList.play($scope.getIndex());
                            };

                            $scope.removeItem = function () {
                                playList.remove($scope.getIndex());
                            };

                            $rootScope.$on('closeTrackActions', function (e, idx) {
                                $scope.displayActions = false;
                            });
                            $rootScope.$on('itemActionsToggled', function (e, idx) {
                                if ($scope.getIndex() !== idx)
                                    $scope.displayActions = false;
                            });
                            $scope.toggleActions = function () {
                                $rootScope.$broadcast('itemActionsToggled', $scope.getIndex());
                                $scope.displayActions = !$scope.displayActions;
                            };

                            $scope.fnPlayNext = function () {
                                if ($scope.playNext)
                                    playList.playNext(null);
                                else
                                    playList.playNext($scope.getIndex());
                            };
                            $scope.fnStopHere = function () {
                                if ($scope.stopHere)
                                    playList.stopAt(null);
                                else
                                    playList.stopAt($scope.getIndex());
                            };
                            $scope.fnRepeatTrack = function () {
                                if ($scope.repeatTrack)
                                    playList.repeatTrack(null);
                                else
                                    playList.repeatTrack($scope.getIndex());
                            };
                        }
                    };

                return definitions;
            }]);
});
