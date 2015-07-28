import './directives/sol-vibrate';
import 'angular';
// duplication of code from Playlist.js with minor change
function mouseCoords(event, targetElement) {
    var totalOffsetX = 0,
        totalOffsetY = 0,
        canvasX = 0,
        canvasY = 0,
        currentElement = targetElement || event.target;

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


export default angular.module('ui.topbar', ['services', 'solVibrate'])
    .directive('appTopbar', ['playList', 'youtubeAPI', function(playList, youtubeAPI) {
        var definitions = {
            restrict: 'E',
            templateUrl: '/html/topbar/bar.html',
            replace: true,
            scope: {

            },
            controller: function($scope, $element, $attrs, $transclude) {
                $scope.$watch(playList.getNowPlaying, function(newVal, oldVal) {
                    var data = newVal ? newVal.snippet : null,
                        thumbnail = data && data.thumbnails && data.thumbnails.default.url;

                    if (data) {
                        $scope.title = data.title || '';
                        $scope.thumbnail = thumbnail || '';
                    }
                });
            }
        };

        return definitions;
    }])
    .directive('mediaControls', ['playList', 'youtubeAPI', function(playList, youtubeAPI) {
        var definitions = {
            restrict: 'E',
            templateUrl: '/html/topbar/controls.html',
            replace: true,
            controller: function($scope, $element, $attrs, $transclude) {
                $scope.playPrev = function() {
                    playList.prev();
                };

                $scope.playNext = function() {
                    playList.next();
                };

                $scope.playToggle = function() {
                    playList.togglePlay();
                };


                $scope.$on('playList:stateChanged', function(e, state) {
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
    .directive('volume', ['$rootScope', 'youtubePlayer', 'playListVolume', function($rootScope, youtubePlayer, playListVolume) {
        var definitions = {
            restrict: 'E',
            templateUrl: '/html/topbar/volume.html',
            replace: true,
            scope: {

            },
            controller: function($scope, $element, $attrs, $transclude) {
                var _slider = $element[0].querySelector('.slider'),
                    _thumb = _slider.querySelector('.thumb'),
                    active = false,
                    getCoordsPercent = function(e, ctx) {
                        var coords = mouseCoords(e, ctx),
                            width = ctx.clientWidth,
                            percent = Math.floor((coords.x / width) * 100);
                        return percent >= 100 ? 100 :
                            percent <= 0 ? 0 :
                            percent;

                    },
                    setWidth = function(e) {
                        var p = getCoordsPercent(e, _slider);

                        playListVolume.set(p);
                    },
                    setRelativeVolume = function(delta) {
                        playListVolume.setRelative(delta);
                    };


                $rootScope.$on('youtubePlayer:infoDelivery', function(e, data) {
                    if (!$scope.$$phase) $scope.$digest();
                });

                $scope.$watch(playListVolume.get, function(value) {
                    $scope.value = value;
                });

                $scope.$watch(playListVolume.isMuted, function(value) {
                    $scope.isMuted = value;
                });

                // Toggle mute
                $scope.toggleMute = function() {
                    playListVolume.toggleMute();
                };

                _slider.addEventListener('mousewheel', function(e) {
                    var deltaY = e.wheelDeltaY;
                    if (deltaY > 0) {
                        setRelativeVolume(5);
                    } else {
                        setRelativeVolume(-5);
                    }
                });

                _slider.addEventListener('mousedown', function(e) {
                    setWidth(e);
                    active = true;
                });


                document.addEventListener('mousemove', function(e) {
                    if (active) {
                        setWidth(e);
                    }
                });

                document.addEventListener('mouseup', function(e) {
                    active = false;
                });
            }
        };

        return definitions;
    }])
    .directive('notifPopup', ['$rootScope', function($rootScope) {
        return {
            restrict: 'E',
            templateUrl: '/html/topbar/notification.html',
            replace: true,
            scope: true,
            controller: function($scope, $element, $attrs, $transclude) {
                $rootScope.$on('notify', function(e, data) {
                    $scope.isActive = true;
                    $scope.thumb = data.thumb;
                    $scope.text = data.text;

                    setTimeout(function(e) {
                        $scope.isActive = false;
                        if (!$scope.$$phase) $scope.$digest();
                    }, 3000);

                    if (!$scope.$$phase) $scope.$digest();
                });
            }
        };
    }]);

