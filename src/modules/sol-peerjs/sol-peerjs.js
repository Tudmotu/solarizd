import 'angular';

export default angular.module('sol-peerjs', ['peerjs-service'])
.service('solPeer',
['$q', '$timeout', 'ApiKey', 'peerJS', function ($q, $timeout, apiKey, peerJS) {
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
                        connection.send({
                            type: 'sync',
                            //playlist: playList.playlist,
                            //currentTime: playList.getTime(),
                            //nowPlaying: playList.getNowPlaying()
                        });
                    });
                });
            });
        },

        connectToServer (remoteId) {
            console.debug('try to connect...', remoteId);
            peerJS.getPeer().then((peer) => {
                let connection = peer.connect(remoteId);
                console.debug('connecting...', remoteId);

                connection.on('open', () => {
                    console.debug('connection to remote established');
                    connection.send({ 'test': true });
                    connection.on('data', (data) => {
                        console.debug('client got data', data);
                    });
                });
            });
        }
    });
}]);
