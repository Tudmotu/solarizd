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
                    console.debug('Someone connected!', connection);
                    connection.on('data', (data) => {
                        console.debug('server got data', data);
                    });
                    connection.on('open', () => {
                        this._sendSync(connection);
                        $rootScope.$watchCollection(() => playList.playlist, () => {
                            console.debug('playlist!');
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
                    connection.on('data', (data) => {
                        $rootScope.$apply(() => {
                            console.debug('client got data', data);
                            playList.setPlaylist(data.playlist);
                        });
                    });
                });
            });
        },

        _sendSync (connection) {
            connection.send({
                type: 'sync',
                playlist: playList.playlist,
                //currentTime: playList.getTime(),
                nowPlaying: playList.getNowPlayingIdx()
            });
        }
    });
}]);
