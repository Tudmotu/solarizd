import '../../js/services/apikey';
import 'angular';
import 'firebase';
import 'angularfire';

export default angular.module('sol-backend', ['firebase', 'api-key'])
.service('solBackend',
        ['$q', '$firebaseAuth', '$firebaseArray', '$firebaseObject', 'ApiKey', '$rootScope',
        function ($q, $firebaseAuth, $firebaseArray, $firebaseObject, apiKey, $rootScope) {
    const connector = $q((resolve, reject) => {
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

    Object.assign(this, {
        authenticateWithPopup () {
            return this.getAuth().then(($auth) => {
                return $auth.$authWithOAuthPopup('google');
            });
        },

        unauthenticate () {
            return this.getAuth().then(($auth) => {
                $auth.$unauth();
            });
        },

        getAuth () {
            return connector.then((firebase) => {
                return $firebaseAuth(firebase);
            });
        },

        getAuthObject () {
            return this.getAuth().then(($auth) => {
                return $auth.$getAuth();
            });
        },

        fetchPlaylist (refKey) {
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
        },

        fetchUserPlaylists (uid) {
            if (typeof uid !== 'string' || !uid) return $q.reject();

            return connector.then((firebase) => {
                let playlists = firebase.child('playlists');
                return $firebaseArray(
                    playlists.orderByChild('uid').equalTo(uid));
            });
        },

        publishPlaylist (playlist) {
            return connector.then((firebase) => {
                return $firebaseArray(firebase.child('playlists'));
            }).then((record) => {
                return this.getAuthObject().then((auth) => {
                    let uid = auth === null ? null : auth.uid;
                    let data = { uid, playlist };

                    return record.$add(data);
                });
            }).then((ref) => {
                return ref.key();
            });
        }
    });

}]);
