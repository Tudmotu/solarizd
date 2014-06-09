define([
    'text!template_dir/media-panel/panel.html',
    'text!template_dir/media-panel/youtube.html',
    './Services',
    'angular'
], function (PanelTemplate, YoutubeTemplate) {
    return angular.module('ui.media-panel', [])
            .directive('mediaPanel', ['playList', function (playList) {
                var definitions = {
                        restrict: 'E',
                        template: PanelTemplate,
                        replace: true,
                        scope: true,
                        controller: function ($scope, $element, $attrs, $transclude) {
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
                        template: YoutubeTemplate,
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
            }]);
});
