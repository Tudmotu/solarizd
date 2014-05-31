define([
    'text!template_dir/media-panel/panel.html',
    'text!template_dir/media-panel/youtube.html',
    'text!template_dir/media-panel/lyrics.html',
    './Services',
    'angular'
], function (PanelTemplate, YoutubeTemplate, LyricsTemplate) {
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
            /**.directive('lyricsPane', ['$sce', 'playList', 'lyricsAPI', function ($sce, playList, lyricsAPI) {
                var definitions = {
                        restrict: 'E',
                        template: LyricsTemplate,
                        replace: true,
                        scope: true,
                        controller: function ($scope, $element, $attrs, $transclude) {
                            var currentlyPlaying = null;

                            $scope.$watch(playList.getNowPlaying, function (newVal, oldVal) {
                                var data = newVal ? newVal.snippet : null;

                                if (data && data.title && newVal.id !== currentlyPlaying) {
                                    console.debug('Fetching lyrics for "' + data.title  + '"...');
                                    currentlyPlaying = newVal.id;

                                    lyricsAPI.fetchByTitle(data.title).then(function (songData) {
                                        $scope.artist    = songData.artist;
                                        $scope.songName  = songData.songName;
                                        $scope.lyrics    = $sce.trustAsHtml(songData.lyrics);
                                        $scope.url       = songData.url;
                                    }, function (err) {
                                        $scope.artist    = '';
                                        $scope.songName  = data.title;
                                        $scope.lyrics    = $sce.trustAsHtml('No lyrics found  =\\');
                                    });
                                }
                            });
                        }
                    };

                return definitions;
            }])*/
            .directive('mediaPlayer', ['$sce', 'youtubeResource', 'youtubePlayer', 'playList', function ($sce, ytResource, ytPlayer, playList) {
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
