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

        onAuth (handler) {
            this.getAuth().then(($auth) => {
                $auth.$onAuth(handler);
            });
        },

        getAuthData () {
            return this.getAuth().then(($auth) => {
                return $auth.$getAuth();
            });
        },

        fetchPlaylist (refKey) {
            return connector.then((firebase) => {
                return $firebaseObject(
                    firebase.child('playlists').child(refKey));
            });
        },

        fetchPlaylistMetadata (refKey) {
            return connector.then((firebase) => {
                return new Promise((resolve, reject) => {
                    let ref = firebase.child('playlists/metadata')
                        .orderByChild('playlist')
                            .equalTo(refKey)
                                .limitToFirst(1);

                    ref.on('child_added', (ref) => {
                        let metadata = firebase.child('playlists/metadata');
                        resolve(metadata.child(ref.key()));
                    });
                }).then((metadata) => $firebaseObject(metadata));
            });
        },

        getPlaylistData (refKey) {
            return this.fetchPlaylist(refKey).then((record) => {
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
                let playlists = firebase.child('playlists/metadata');
                let ref = playlists.orderByChild('uid').equalTo(uid);
                return $firebaseArray(ref);
            });
        },

        savePlaylist (metadata, playlist) {
            return connector.then((firebase) => {
                let playlists = firebase.child('playlists');
                let ref = playlists.child(metadata.playlist);

                return ref.update({ playlist, metadata_id: metadata.$id });
            });
        },

        publishPlaylist (playlist, playlistMetadata = {}) {
            let firebase;
            let auth;

            return connector.then((_firebase) => {
                firebase = _firebase;
            }).then(() => {
                return this.getAuthData();
            }).then((_auth) => {
                auth = _auth;
            }).then(() => {
                let playlists = firebase.child('playlists');
                let data = { playlist };

                return playlists.push(data);
            }).then((ref) => {
                let metadata = firebase.child('playlists/metadata');
                let uid = auth === null ? null : auth.uid;
                let data = {
                    uid,
                    playlist: ref.key(),
                    name: playlistMetadata.name || null,
                    public: playlistMetadata.public || null
                };

                return metadata.push(data);
            }).then((ref) => {
                return $q((resolve) => {
                    ref.child('playlist').once('value', (snapshot) => {
                        let playlist = snapshot.val();
                        resolve(playlist);
                    });
                });
            });
        }
    });

}]);
