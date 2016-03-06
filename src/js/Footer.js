import 'angular';

export default angular.module('ui.footer', ['services', 'filters', 'sol-backend', 'firebase', 'google-signin'])
    .directive('appFooter',
            ['$rootScope', '$http', 'solBackend', '$firebaseAuth',
            ($rootScope, $http, solBackend, $firebaseAuth) => {
        var definitions = {
            restrict: 'E',
            templateUrl: '/html/footer/bar.html',
            replace: true,
            scope: true,
            controller: function($scope, $element, $attrs, $transclude) {
                $scope.appTitle = document.getElementsByTagName('title')[0].textContent;
            }
        };

        return definitions;
    }]);
