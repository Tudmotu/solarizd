define([
    'text!template_dir/playlist/pane.html',
    'text!template_dir/playlist/progress.html',
    'text!template_dir/playlist/item.html',
    'text!template_dir/playlist/related.html',
    './Services',
    'angular'
], function (PaneTemplate, ProgressTemplate, ItemTemplate, RelatedTemplate) {
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

    return angular.module('ui.playlist', ['services', 'filters'])
            .directive('playlistPane', ['$rootScope', '$http', 'youtubeAPI', 'playList', function ($rootScope, $http, youtubeAPI, playList) {
                var definitions = {
                        restrict: 'E',
                        template: PaneTemplate,
                        replace: true,
                        scope: true,
                        link: function ($scope, $element, $attrs) {
                            var media = window.matchMedia('(max-width:960px),(max-device-width:960px)');
                            if (media.matches) {
                                $scope.ready = true;
                            }
                            else {
                                $rootScope.$on('searchPane:loaded', function () {
                                    $scope.ready = true;
                                    if (!$scope.$$phase) $scope.$digest();
                                });
                            }

                            if (playList.playlist.length) {
                                $rootScope.$broadcast('setCurrentView', 'playlist');
                            }

                            $rootScope.$on('playList:stateChanged', function (e, state) {
                                $scope.nowPlayingIdx = playList.getNowPlayingIdx();
                                if (!$scope.$$phase) $scope.$digest();
                            });
                        },
                        controller: function ($scope, $element, $attrs, $transclude) {
                            $scope.items = playList.playlist;
                        }
                    };

                return definitions;
            }]).directive('playlistProgress', ['$rootScope', 'youtubePlayer', function ($rootScope, youtubePlayer) {
                var definitions = {
                        restrict: 'E',
                        template: ProgressTemplate,
                        replace: true,
                        scope: true,
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
                        template: ItemTemplate,
                        replace: true,
                        scope: {
                            'videoId': '@videoId',
                            'title': '@title',
                            'thumbnail': '@thumbnail',
                            'autoplay': '@autoplay',
                            'index': '@index'
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
                        }
                    };

                return definitions;
            }]).directive('playlistRelated', ['$rootScope', 'youtubePlayer', 'youtubeAPI', 'playList', function ($rootScope, youtubePlayer, youtubeAPI, playList) {
                var definitions = {
                        restrict: 'E',
                        template: RelatedTemplate,
                        replace: true,
                        scope: {
                        },
                        controller: function ($scope, $element, $attrs, $transclude) {
                            $scope.addItem = function (videoId) {
                                console.debug(videoId);
                                playList.addLast(videoId);
                            };
                            $scope.$watch(playList.getNowPlaying, function (item) {
                                if (item) {
                                    youtubeAPI.getRelated(item.id).then(function (items) {
                                        $scope.items = items;
                                    });
                                }
                            });
                        }
                    };
                return definitions;
            }]);
});
