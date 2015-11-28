import 'angular';

export default angular.module('sol-peerjs', ['peerjs-service'])
.service('solPeer',
['$q', '$timeout', '$rootScope', 'ApiKey', 'peerJS', 'playList', 'playListVolume',
function ($q, $timeout, $rootScope, apiKey, peerJS, playList, playListVolume) {
    Object.assign(this, {
        peerId: null,

        createServer () {
            peerJS.getPeer().then((peer) => {
                if (peer.id) this.peerId = peer.id;
                else
                    peer.on('open', (peerId) => {
                        $timeout(() => this.peerId = peerId);
                    });

                peer.on('connection', (connection) => {
                    connection.on('open', () => {
                        console.debug('Server got new connection');
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
            peerJS.getPeer().then((peer) => {
                let connection = peer.connect(remoteId);

                connection.on('open', () => {
                    console.debug('Client connected to server');
                    $rootScope.$broadcast('peer::connected_to_server');

                    $rootScope.$on(
                            'peer::send_action_to_server', (e, action) => {
                        console.debug('send an action to server', action);
                        this._sendAction(connection, action);
                    });

                    connection.on('data', (data) => {
                        $rootScope.$broadcast(
                            'peer::got_data_from_server', data);
                    });
                });
            });
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

        _sendAction (connection, action) {
            connection.send(action);
        }
    });
}]);
