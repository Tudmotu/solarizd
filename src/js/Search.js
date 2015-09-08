import './directives/sol-scroll2top';
import './Services';
import './Filters';
import 'angular';
export default angular.module('ui.search', ['services', 'filters', 'solScroll2top'])
    .directive('searchPane', ['$timeout', 'youtubeAPI', function($timeout, youtubeAPI) {
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
                        });
                    }, 600);
                };

                $scope.$watch('query', $scope.search);
            }
        };
    }]).directive('searchResultList', [() => {
        return {
            restrict: 'E',
            templateUrl: '/html/search/result-list.html',
            replace: true,
            scope: {
                items: '='
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
