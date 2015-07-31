import TopbarTemplate from './Services';
import FooterTemplate from 'angular';
export default angular.module('ui.footer', ['services', 'filters'])
    .directive('appFooter', ['$rootScope', '$http', function($rootScope, $http) {
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
