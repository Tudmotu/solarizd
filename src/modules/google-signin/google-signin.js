import 'angular';

export default angular.module('google-signin', ['services', 'filters', 'sol-backend', 'firebase'])
    .directive('googleSignin',
            ['$rootScope', '$http', 'solBackend', '$firebaseAuth',
            ($rootScope, $http, solBackend, $firebaseAuth) => {
        var definitions = {
            restrict: 'E',
            templateUrl: '/modules/google-signin/google-signin.html',
            replace: true,
            scope: true,
            controller: function($scope, $element, $attrs, $transclude) {
                $scope.toggleGoogleAuth = () => {
                    if (!$scope.authenticated)
                        solBackend.authenticateWithPopup();
                    else
                        solBackend.unauthenticate();
                };

                solBackend.getAuth().then(($auth) => {
                    $auth.$onAuth((auth) => {
                        if (auth && auth.uid) {
                            $scope.authenticated = true;
                            $scope.authData = auth.google;
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
