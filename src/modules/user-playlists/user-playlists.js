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

                    this.$on('$locationChangeSuccess', () => {
                        let id = $location.search().playlist;
                        this.selectEntry(id);
                    });
                },

                toggleEditMode () {
                    this.editMode = !this.editMode;
                },
                removeEntry (idx) {
                    this.playlists.$remove(idx);
                },
                selectEntry (id) {
                    if (!id) return;

                    let el = this._findEntryById(id);
                    this._removeClassFromCurrentSelection();
                    this._addSelectionClassToElement(el);
                    $location.search('playlist', id);
                },
                _findEntryById (id) {
                    return $element.find(`.playlist[data-id=${id}]`).eq(0);
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
