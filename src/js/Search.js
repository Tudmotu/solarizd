import './directives/sol-scroll2top';
import './Services';
import './Filters';
import 'angular';
export default angular.module('ui.search', ['services', 'filters', 'solScroll2top'])
    .directive('searchPane', ['$timeout', 'youtubeAPI', 'lastfm', function($timeout, youtubeAPI, lastfm) {
        return {
            restrict: 'E',
            templateUrl: '/html/search/pane.html',
            replace: true,
            scope: true,
            link: function($scope, $element, $attrs, $transclude) {
                let lastSearch = null;

                $scope.query = '';
                $scope.search = (value) => {
                    if (lastSearch)
                        clearTimeout(lastSearch);

                    lastSearch = setTimeout(() => {
                        $scope.searching = true;

                        youtubeAPI.search($scope.query).then(function(items) {
                            $scope.$emit('items-fetched', items);
                            $scope.items = items;
                            $scope.searching = false;

                            $scope.albums = [];
                            lastfm.albumSearch($scope.query).then(albums => {
                                return $timeout(() => {
                                    $scope.albums = albums;
                                });
                            });
                        });
                    }, 600);
                };

                $scope.$watch('query', $scope.search);
            }
        };
    }]).directive('searchResultList', ['youtubeAPI', 'playList', 'lastfm', (youtubeAPI, playList, lastfm) => {
        return {
            restrict: 'E',
            templateUrl: '/html/search/result-list.html',
            replace: true,
            scope: {
                items: '=',
                albums: '='
            },
            link: function($scope, $element, $attrs, $transclude) {
                $scope.addAlbum = (album) => {
                    Promise.all(album.tracks.track.map(track => {
                        let title = track.name.replace(
                            /\([^(]*(version|remaster(ed)?|remix).*?\)/i, '');
                        let artist = album.artist;
                        let videoDuration = track.duration < 260 ?
                            'short' : (track.duration < 1200 ?
                                'medium' : 'long');

                        return youtubeAPI.search({
                            q: `${artist} ${title}`,
                            maxResults: 1,
                            videoDuration
                        }).then(items => items[0]);
                    })).then(results => {
                        playList.addBulk(results);
                    });
                };
            }
        };
    }]).directive('searchResultItem', ['$rootScope', '$http', 'playList', function($rootScope, $http, playList) {
        return {
            restrict: 'E',
            templateUrl: '/html/search/result.html',
            replace: true,
            scope: {
                videoId: '@videoId',
                title: '@title',
                description: '@description',
                thumbnail: '@thumbnail',
                duration: '@duration'
            },
            controller: function($scope, $element, $attrs, $transclude) {
                $scope.emitAddLast = function() {
                    playList.addLast($scope.videoId);
                };
            }
        };
    }]);
