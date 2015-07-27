define([
    'text!template_dir/search/pane.html',
    'text!template_dir/search/result-list.html',
    'text!template_dir/search/result.html',
    'text!template_dir/search/input.html',
    './directives/sol-scroll2top',
    './Services',
    './Filters',
    '../vendor/angular/angular'
], function (PaneTemplate, ResultListTemplate, ResultTemplate, InputTemplate) {
    return angular.module('ui.search', ['services', 'filters', 'solScroll2top'])
            .directive('searchPane', ['$rootScope', '$http', function ($rootScope, $http) {
                var definitions = {
                        restrict: 'E',
                        template: PaneTemplate,
                        replace: true,
                        scope: {

                        },
                        link: function ($scope, $element, $attrs, $transclude) {
                            $element.on('transitionend', function (e) {
                                if (e.target === $element[0])
                                    $rootScope.$broadcast('searchPane:loaded');
                            });
                        }
                    };

                return definitions;
            }]).directive('searchResultList', ['$rootScope', '$http', 'youtubeAPI', function ($rootScope, $httpi, youtubeAPI) {
                var definitions = {
                        restrict: 'E',
                        template: ResultListTemplate,
                        replace: true,
                        scope: {

                        },
                        controller: function ($scope, $element, $attrs, $transclude) {
                            $rootScope.$on('items-fetched', function (e, data) {
                                $scope.items = data;
                            });
                        }
                    };

                return definitions;
            }]).directive('searchResultItem', ['$rootScope', '$http', 'playList', function ($rootScope, $http, playList) {
                var definitions = {
                        restrict: 'E',
                        template: ResultTemplate,
                        replace: true,
                        scope: {
                            videoId: '@videoId',
                            title: '@title',
                            description: '@description',
                            thumbnail: '@thumbnail',
                            duration: '@duration'
                        },
                        controller: function ($scope, $element, $attrs, $transclude) {
                            $scope.emitAddLast = function () {
                                playList.addLast($scope.videoId);
                            };
                        }
                    };

                return definitions;
            }]).directive('searchInput', ['$rootScope', 'youtubeAPI', function ($rootScope, youtubeAPI) {
                var definitions = {
                        restrict: 'E',
                        template: InputTemplate,
                        replace: true,
                        scope: {

                        },
                        controller: function ($scope, $element, $attrs, $transclude) {
                            var lastSearch = null,
                                search = function () {
                                    $scope.$parent.searching = true;
                                    youtubeAPI.search($scope.query)
                                        .then(function (items) {
                                        $scope.$emit('items-fetched', items);
                                        $scope.$parent.searching = false;
                                    });
                                };

                            $scope.query = '';
                            $scope.search = function () {
                                if (lastSearch) clearTimeout(lastSearch);
                                lastSearch = setTimeout(function () {
                                    search();
                                    lastSearch = null;
                                }, 640);
                            };

                            // Hack so virtual kb will disappear when hitting 'go' on search
                            $element.on('keyup', function (e) {
                                if (e.keyCode === 13) {
                                    e.target.blur();
                                }
                            });
                        },
                        link: function ($scope, $element, $attrs) {
                            $scope.$watch('query', function (value) {
                                $scope.search(value);
                            });
                        }
                    };

                return definitions;
            }]);
});
