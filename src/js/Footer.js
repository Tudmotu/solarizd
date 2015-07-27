define([
    'text!template_dir/topbar/bar.html',
    'text!template_dir/footer/bar.html',
    'text!template_dir/footer/apikey.html',
    './Services',
    '../vendor/angular/angular'
], function (TopbarTemplate, FooterTemplate, ApikeyInputTemplate) {
    return angular.module('ui.footer', ['services', 'filters'])
            .directive('appFooter', ['$rootScope', '$http', function ($rootScope, $http) {
                var definitions = {
                        restrict: 'E',
                        template: FooterTemplate,
                        replace: true,
                        scope: true,
                        controller: function ($scope, $element, $attrs, $transclude) {
                            $scope.appTitle = document.getElementsByTagName('title')[0].textContent;
                        }
                    };
                
                return definitions;
            }]);
});
