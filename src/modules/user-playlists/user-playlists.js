import 'angular';

export default angular.module('user-playlists', []).directive(
'userPlaylists', ['$location', ($location) => {
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
        }
    };
}]);
