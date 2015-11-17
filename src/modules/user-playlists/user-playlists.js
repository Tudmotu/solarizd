import 'angular';

export default angular.module('user-playlists', ['sol-backend'])
.directive('userPlaylists',
        ['$location', 'solBackend', ($location, solBackend) => {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/modules/user-playlists/user-playlists.html',
        scope: {},
        link: ($scope, $element) => {
            Object.assign($scope, {
                editMode: false,

                init () {
                    solBackend.onAuth((authData) => {
                        let uid = (authData && authData.uid) || null;

                        solBackend.fetchUserPlaylists(uid).catch(() => {
                            return null;
                        }).then((playlists) => {
                            this.playlists = playlists;
                        });
                    });
                },

                toggleEditMode () {
                    this.editMode = !this.editMode;
                },
                removeEntry (idx) {
                    this.playlists.$remove(idx);
                },
                selectEntry (idx) {
                    this._removeClassFromCurrentSelection();
                    this._addSelectionClassToElement(idx);
                    this._modifyLocation(idx);
                },
                _findEntry (idx) {
                    return $element.find('.playlist').eq(idx);
                },
                _findEntryAsElement (idx) {
                    return this._findEntry(idx)[0];
                },
                _removeClassFromCurrentSelection () {
                    let previous = $element.find('.playlist.selected');
                    [...previous].forEach(
                        el => el.classList.remove('selected'));
                },
                _addSelectionClassToElement (idx) {
                    let entry = this._findEntryAsElement(idx);
                    entry.classList.add('selected');
                },
                _modifyLocation (idx) {
                    let entry = this._findEntryAsElement(idx);
                    let refId = entry.getAttribute('data-id');
                    $location.search('playlist', refId);
                }
            });

            $scope.init();
        }
    };
}]);
