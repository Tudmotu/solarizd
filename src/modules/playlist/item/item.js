import Filters from '../../../js/Filters';

export default [
        '$rootScope', '$http', 'playList',
        function($rootScope, $http, playList) {
    var definitions = {
        restrict: 'E',
        //template: '<div class="playlist-item"></div>',
        templateUrl: '/modules/playlist/item/item.html',
        replace: true,
        scope: {
            'title': '@',
            'duration': '@',
            'progress': '@',
            'active': '@',
            'playNext': '@',
            'stopHere': '@',
            'repeat': '@',
            'index': '@index',
            //'videoId': '@videoId',
            //'thumbnail': '@thumbnail',
            //'autoplay': '@autoplay',
            //'nowPlaying': '=nowPlaying',
            //'playNext': '=playNext',
            //'repeatTrack': '=repeatTrack',
            //'progress': '=progress',
            //'index': '@index'
        },
        link: function($scope, $element, $attrs, $transclude) {
            Object.assign($scope, {
                get idx () {
                    return parseInt($scope.index, 10);
                },
                isPlaying: () => {
                    let progress = parseInt($scope.progress, 10);

                    return progress > 0;
                },
                actions: {
                    toggle: () => {
                        if ($scope.isPlaying())
                            playList.togglePlay();
                        else
                            playList.play(parseInt($scope.index, 10));
                    },
                    playNext: () => {
                        if ($scope.playNext)
                            playList.playNext(null);
                        else
                            playList.playNext($scope.idx);
                    },
                    stopHere: () => {
                        if ($scope.stopHere)
                            playList.stopAt(null);
                        else
                            playList.stopAt($scope.idx);
                    },
                    repeat: () => {
                        if ($scope.repeat)
                            playList.repeatTrack(null);
                        else
                            playList.repeatTrack($scope.idx);
                    },
                    remove: () => {
                        playList.remove($scope.idx);
                    }
                }
            });
            /*$rootScope.$on('youtubePlayer:infoDelivery', function(e, state) {
                $scope.nowPlaying = playList.getNowPlayingIdx() === $scope.getIndex();
                $scope.isActive = ($scope.nowPlaying &&
                    playList.getState() === playList.st.PLAYING);

                if (!$scope.$$phase) $scope.$digest();
            });
            $rootScope.$on('playList:stateChanged', function(e, state) {
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

            $scope.getIndex = function() {
                return parseInt($scope.index, 10);
            };

            $scope.pause = function() {
                playList.pause();
            };

            $scope.togglePlay = function() {
                if ($scope.isActive)
                    playList.pause();
                else
                    playList.play($scope.getIndex());
            };

            $scope.removeItem = function() {
                playList.remove($scope.getIndex());
            };

            $rootScope.$on('closeTrackActions', function(e, idx) {
                $scope.displayActions = false;
            });
            $rootScope.$on('itemActionsToggled', function(e, idx) {
                if ($scope.getIndex() !== idx)
                    $scope.displayActions = false;
            });
            $scope.toggleActions = function() {
                $rootScope.$broadcast('itemActionsToggled', $scope.getIndex());
                $scope.displayActions = !$scope.displayActions;
            };

            $scope.fnPlayNext = function() {
                if ($scope.playNext)
                    playList.playNext(null);
                else
                    playList.playNext($scope.getIndex());
            };
            $scope.fnStopHere = function() {
                if ($scope.stopHere)
                    playList.stopAt(null);
                else
                    playList.stopAt($scope.getIndex());
            };
            $scope.fnRepeatTrack = function() {
                if ($scope.repeatTrack)
                    playList.repeatTrack(null);
                else
                    playList.repeatTrack($scope.getIndex());
            };*/
        }
    };

    return definitions;
}];
