import 'angular';

export default angular.module('user-playlists', ['sol-backend'])
.directive('userPlaylists',
        ['$location', '$timeout', 'solBackend', ($location, $timeout, solBackend) => {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/modules/user-playlists/user-playlists.html',
        scope: {},
        link: ($scope, $element) => {
            Object.assign($scope, {
                init () {
                    solBackend.onAuth((authData) => {
                        let uid = (authData && authData.uid) || null;

                        solBackend.fetchUserPlaylists(uid).catch(() => {
                            return null;
                        }).then((playlists) => {
                            this.playlists = playlists;
                        }).then(() => {
                            this._selectEntryFromLocation();
                        });
                    });

                    this.$on('$locationChangeSuccess', () => {
                        this._selectEntryFromLocation();
                    });
                },

                toggleEditMode () {
                    // This method is called on the nested scope
                    this.editMode = !this.editMode;
                },
                removeEntry (idx) {
                    this.playlists.$remove(idx);
                },
                selectEntry (id) {
                    $location.search('playlist', id);
                },
                _selectEntryFromLocation () {
                    let id = $location.search().playlist;
                    this.currentPlaylist = id;
                },
                _findEntryById (id) {
                    return $element.find(`.playlist[data-id="${id}"]`).eq(0);
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
                _addSelectionClassToElement (el) {
                    el[0].classList.add('selected');
                }
            });

            $scope.init();
        }
    };
}]);
