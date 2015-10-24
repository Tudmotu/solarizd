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
                editMode: false,
                toggleEditMode () {
                    this.editMode = !this.editMode;
                },
                removeEntry (idx) {
                    this.playlists.splice(idx, 1);
                },
                selectEntry (idx) {
                    let previous = $element.find('.playlist.selected');
                    let entry = $element.find('.playlist').eq(idx);
                    [...previous].forEach(
                        el => el.classList.remove('selected'));
                    entry[0].classList.add('selected');
                }
            });
        }
    };
}]);
