define([
    './directives/sol-vibrate',
    './MediaBar',
    './Services',
    '../vendor/angular/angular'
], function () {
    return angular.module('ui.media-panel', ['solVibrate', 'ui.mediaBar'])
            .directive('mediaPanel', ['playList', function (playList) {
                var definitions = {
                        restrict: 'E',
                        templateUrl: '/html/media-panel/panel.html',
                        replace: true,
                        scope: true,
                        controller: function ($scope, $element, $attrs, $transclude) {
                            $scope.setIsCued = function (val) {
                                val = typeof val === 'boolean' ? val : true;
                                $scope.isCued = val;
                            };

                            $scope.toggleVideo = function () {
                                $element.toggleClass('show-video');
                            };
                            $scope.$watch(playList.getNowPlaying, function (newVal, oldVal) {
                                if (newVal)
                                    $element.addClass('active');
                            });

                            $scope.$on('youtubePlayer:videoCued', function (e, data) {
                                $scope.isCued = true;
                            });

                            $scope.$on('youtubePlayer:onStateChange', function (e, data) {
                                if (data.info === YT.PlayerState.PLAYING) {
                                    $scope.isCued = false;
                                    if (!$scope.$$phase) $scope.$digest();
                                }
                            });
                        }
                    };

                return definitions;
            }])
            .directive('mediaPlayer', ['$sce', 'youtubePlayer', 'playList', function ($sce, ytPlayer, playList) {
                var definitions = {
                        restrict: 'E',
                        templateUrl: '/html/media-panel/youtube.html',
                        replace: true,
                        scope: true,
                        link: function ($scope, $element) {
                            ytPlayer.setElement($element.attr('id'));
                        },
                        controller: function ($scope, $element, $attrs, $transclude) {
                            $scope.nowPlaying = ytPlayer.nowPlaying;
                        }
                    };

                return definitions;
            }]).directive('playlistRelated', ['$rootScope', 'youtubePlayer', 'youtubeAPI', 'playList', function ($rootScope, youtubePlayer, youtubeAPI, playList) {
                var definitions = {
                        restrict: 'E',
                        templateUrl: '/html/media-panel/related.html',
                        replace: true,
                        scope: {
                        },
                        controller: function ($scope, $element, $attrs, $transclude) {
                            $scope.addItem = function (videoId) {
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
