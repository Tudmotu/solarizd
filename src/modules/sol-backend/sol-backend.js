import 'angular';
import 'firebase';
import 'angularfire';


export default angular.module('solBackend', ['firebase'])
.service('solBackend',
        ['$q', '$firebaseArray', '$firebaseObject', 'ApiKey', '$rootScope',
        function ($q, $firebaseArray, $firebaseObject, apiKey, $rootScope) {

    let connector = $q((resolve, reject) => {
        let key = apiKey.get('firebase');

        if (key) {
            let url = `https://${key}.firebaseio.com`;
            let ref = new Firebase(url);
            resolve(ref);
        }
        else {
            $rootScope.$on('firebase-apikey', function(e, key) {
                let url = `https://${key}.firebaseio.com`;
                let ref = new Firebase(url);
                resolve(ref);
            });
        }
    });

    this.publishPlaylist = function (playlist) {
        return connector.then((firebase) => {
            return $firebaseArray(firebase.child('playlists'));
        }).then((record) => {
            return record.$add({ playlist: playlist });
        }).then((ref) => {
            return ref.key();
        });
    };

    this.fetchPlaylist = function (refKey) {
        return connector.then((firebase) => {
            return $firebaseObject(firebase.child('playlists').child(refKey));
        }).then((record) => {
            return $q((resolve, reject) => {
                record.$ref().once('value', (snap) => {
                    let val = snap.val();
                    if (val !== null && Array.isArray(val.playlist))
                        resolve(val.playlist);
                    else
                        reject();
                });
            });
        });
    };
}]);
