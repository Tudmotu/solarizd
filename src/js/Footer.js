import TopbarTemplate from './Services';
import FooterTemplate from 'angular';
export default angular.module('ui.footer', ['services', 'filters', 'solBackend', 'firebase'])
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
                $scope.toggleGoogleAuth = () => {
                    if (!$scope.authenticated)
                        solBackend.authenticateWithPopup();
                    else
                        solBackend.unauthenticate();
                };

                solBackend.getAuth().then(($auth) => {
                    $auth.$onAuth((auth) => {
                        console.debug('bla bla', auth);
                        if (auth && auth.uid) {
                            $scope.authenticated = true;
                            $scope.fullName = auth.google.displayName;
                        }
                        else {
                            $scope.authenticated = false;
                        }
                    });
                });
            }
        };

        return definitions;
    }]);
