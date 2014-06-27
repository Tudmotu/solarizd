define([
    'text!template_dir/topbar/bar.html',
    'text!template_dir/topbar/controls.html',
    'text!template_dir/topbar/volume.html',
    'text!template_dir/topbar/notification.html',
    './directives/sol-vibrate',
    'angular'
], function (TopbarTemplate, ControlsTemplate, VolumeTemplate, NotificationTemplate) {
    // duplication of code from Playlist.js with minor change
    function mouseCoords (event, targetElement) {
        var totalOffsetX = 0,
            totalOffsetY = 0,
            canvasX = 0,
            canvasY = 0,
            currentElement = targetElement || event.target;

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


    return angular.module('ui.topbar', ['services', 'solVibrate'])
            .directive('appTopbar', ['playList', 'youtubeAPI', function (playList, youtubeAPI) {
                var definitions = {
                        restrict: 'E',
                        template: TopbarTemplate,
                        replace: true,
                        scope: {

                        },
                        controller: function ($scope, $element, $attrs, $transclude) {
                            $scope.$watch(playList.getNowPlaying, function (newVal, oldVal) {
                                var data = newVal ? newVal.snippet : null,
                                    thumbnail = data && data.thumbnails && data.thumbnails.default.url;

                                if (data) {
                                    $scope.title      = data.title || '';
                                    $scope.thumbnail  = thumbnail || '';
                                }
                            });
                        }
                    };

                return definitions;
            }])
            .directive('mediaControls', ['playList', 'youtubeAPI', function (playList, youtubeAPI) {
                var definitions = {
                        restrict: 'E',
                        template: ControlsTemplate,
                        replace: true,
                        controller: function ($scope, $element, $attrs, $transclude) {
                            $scope.playPrev = function () {
                                playList.prev();
                            };

                            $scope.playNext = function () {
                                playList.next();
                            };

                            $scope.playToggle = function () {
                                playList.togglePlay();
                            };


                            $scope.$on('playList:stateChanged', function (e, state) {
                                $scope.isActive = playList.getNowPlaying() &&
                                                    state === playList.st.PLAYING;
                                $scope.isBuffering = playList.getNowPlaying() && [
                                    playList.st.PLAYING,
                                    playList.st.PAUSING,
                                    playList.st.STOPPED
                                ].indexOf(state) < 0; 

                                if (!$scope.$$phase) $scope.$digest();
                            });
                        }
                    };

                return definitions;
            }])
            .directive('volume', ['$rootScope', 'youtubePlayer', function ($rootScope, youtubePlayer) {
                var definitions = {
                        restrict: 'E',
                        template: VolumeTemplate,
                        replace: true,
                        scope: {

                        },
                        controller: function ($scope, $element, $attrs, $transclude) {
                            var _slider = $element[0].querySelector('.slider'),
                                _thumb  = _slider.querySelector('.thumb'),
                                active  = false,
                                getCoordsPercent = function (e, ctx) {
                                    var coords  = mouseCoords(e, ctx),
                                        width   = ctx.clientWidth,
                                        percent = Math.floor((coords.x / width)*100);
                                    return percent >= 100 ? 100 :
                                            percent <= 0 ? 0 :
                                             percent;
                                },
                                setWidth = function (e) {
                                    var p = getCoordsPercent(e, _slider);
                                    $scope.value = p;
                                    youtubePlayer.setVolume(p);

                                    if (!$scope.$$phase) $scope.$digest();
                                };

                            $rootScope.$on('youtubePlayer:infoDelivery', function (e, data) {
                                var changed = false;
                                if (data.info.hasOwnProperty('muted')) {
                                    $scope.isMuted = data.info.muted;
                                    changed = true;
                                }

                                if (data.info.hasOwnProperty('volume')) {
                                    $scope.value = data.info.volume;
                                    changed = true;
                                }

                                if (changed && !$scope.$$phase) $scope.$digest();
                            });

                            _slider.addEventListener('mousedown', function (e) {
                                setWidth(e);
                                active = true;
                            });

                            document.addEventListener('mousemove', function (e) {
                                if (active) {
                                    setWidth(e);
                                }
                            });

                            document.addEventListener('mouseup', function (e) {
                                active = false;
                            });

                            // Toggle mute
                            $scope.toggleMute = function () {
                                youtubePlayer.toggleMute();
                            };
                        }
                    };

                return definitions;
            }])
            .directive('notifPopup', ['$rootScope', function ($rootScope) {
                return {
                    restrict: 'E',
                    template: NotificationTemplate,
                    replace: true,
                    scope: true,
                    controller: function ($scope, $element, $attrs, $transclude) {
                        $rootScope.$on('notify', function (e, data) {
                            $scope.isActive = true;
                            $scope.thumb = data.thumb;
                            $scope.text = data.text;

                            setTimeout(function (e) {
                                $scope.isActive = false;
                                if (!$scope.$$phase) $scope.$digest();
                            }, 3000);

                            if (!$scope.$$phase) $scope.$digest();
                        });
                    }
                };
            }]);
});

