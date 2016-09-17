import 'angular';

export default angular.module('sol-peerjs', ['peerjs-service', 'services'])
.service('solPeer',
['$q', '$timeout', '$rootScope', 'ApiKey', 'peerJS', 'playList', 'playListVolume',
function ($q, $timeout, $rootScope, apiKey, peerJS, playList, playListVolume) {
    let remoteServerConnection;

    Object.assign(this, {
        peerId: null,

        getPeer () {
            return peerJS.getPeer().then((peer) => {
                if (peer.id) this.peerId = peer.id;
                else
                    peer.on('open', (peerId) => {
                        $timeout(() => this.peerId = peerId);
                    });

                return peer;
            });
        },

        createServer () {
            this.getPeer().then((peer) => {
                peer.on('connection', (connection) => {
                    connection.on('open', () => {
                        this._sendSync(connection);

                        $rootScope.$on('peer::sync_clients', () => {
                            this._sendSync(connection);
                        });

                        connection.on('data', (data) => {
                            $rootScope.$broadcast(
                                'peer::got_action_from_client', data);
                        });
                    });
                });
            });
        },

        connectToServer (remoteId) {
            this.disconnectFromServer();

            return this.getPeer().then((peer) => {
                return new Promise((resolve, reject) => {
                    let connection = peer.connect(remoteId);

                    connection.on('open', () => {
                        $rootScope.$broadcast('peer::connected_to_server');
                        remoteServerConnection = connection;

                        connection.on('data', (data) => {
                            $rootScope.$broadcast(
                                'peer::got_data_from_server', data);
                        });

                        connection.on('close', (data) => {
                            $rootScope.$broadcast(
                                'peer::disconnected_from_server');
                            remoteServerConnection = null;
                        });

                        resolve();
                    });

                    connection.on('error', (e) => {
                        console.error('errors in peerjs', e);
                        reject(e);
                    });
                });
            });
        },

        disconnectFromServer () {
            if (!remoteServerConnection) return;
            remoteServerConnection.close();
        },

        destroyPeer () {
            peerJS.destroyPeer();
            this.peerId = null;
        },

        isConnectedToHost () {
            return remoteServerConnection &&
                !remoteServerConnection.disconnected;
        },

        _sendSync (connection) {
            connection.send({
                type: 'sync',
                playlist: playList.playlist,
                playlistState: playList.getState(),
                currentProgress: playList.getProgress(),
                currentDuration: playList.getDuration(),
                nowPlaying: playList.getNowPlayingIdx(),
                volumeLevel: playListVolume.get(),
                isMuted: playListVolume.isMuted()
            });
        },

        _setupClientEvents () {
            $rootScope.$on('peer::send_action_to_server', (e, action) => {
                if (!remoteServerConnection) return;

                this._sendAction(remoteServerConnection, action);
            });
        },

        _sendAction (connection, action) {
            connection.send(action);
        }
    });

    this._setupClientEvents();
}]);
