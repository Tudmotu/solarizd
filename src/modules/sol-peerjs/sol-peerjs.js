import 'angular';

export default angular.module('sol-peerjs', ['peerjs-service'])
.service('solPeer',
['$q', '$timeout', '$rootScope', 'ApiKey', 'peerJS', 'playList',
function ($q, $timeout, $rootScope, apiKey, peerJS, playList) {
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
                        this._sendSync(connection);
                        $rootScope.$on('peer::sync_clients', () => {
                            this._sendSync(connection);
                        });
                    });
                });
            });
        },

        connectToServer (remoteId) {
            peerJS.getPeer().then((peer) => {
                let connection = peer.connect(remoteId);

                connection.on('open', () => {
                    $rootScope.$broadcast('peer::connected_to_server');

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
                nowPlaying: playList.getNowPlayingIdx()
            });
        }
    });
}]);
