define([
    'text!template_dir/topbar/bar.html',
    'text!template_dir/footer/bar.html',
    'text!template_dir/footer/apikey.html',
    'google-plus-signin',
    './Services',
    'angular'
], function (TopbarTemplate, FooterTemplate, ApikeyInputTemplate) {
    return angular.module('ui.footer', ['services', 'filters', 'directive.g+signin'])
            .directive('appFooter', ['$rootScope', '$http', '$compile', 'ApiKey',
                function ($rootScope, $http, $compile, ApiKey) {
                var definitions = {
                        restrict: 'E',
                        template: FooterTemplate,
                        replace: true,
                        scope: true,
                        controller: function ($scope, $element, $attrs, $transclude) {
                            $scope.appTitle = document.getElementsByTagName('title')[0].textContent;

                            $scope.getGoogleClientId = function () {
                                return ApiKey.get('google-client-id');
                            };

                            $scope.$watch('getGoogleClientId()', function (value) {
                                var el;
                                var button;
                                var gSignin = $element.find('.google-signin');

                                if (value && gSignin.length > 0) {
                                    button = angular.element(document.createElement('google-plus-signin'));
                                    button[0].setAttribute('clientid', value);
                                    button[0].setAttribute('scope', 'https://www.googleapis.com/auth/youtube.readonly');
                                    button[0].setAttribute('requestvisibleactions', '');
                                    button[0].setAttribute('width', 'standard');

                                    el = $compile(button)($scope);

                                    gSignin.replaceWith(el);
                                }
                            });

                            $rootScope.$on('event:google-plus-signin-success', function (e, authResult) {
                                ApiKey.set('youtube-oauth2', authResult.access_token);
                            });
                        }
                    };

                return definitions;
            }]);
});
