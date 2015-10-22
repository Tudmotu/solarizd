import 'angular';

export default angular.module('user-playlists', []).directive(
'userPlaylists', [() => {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/modules/user-playlists/user-playlists.html',
        scope: {
            playlists: '='
        },
        link: ($scope, $element) => {
            Object.assign($scope, {

            });
        }
    };
}]);
