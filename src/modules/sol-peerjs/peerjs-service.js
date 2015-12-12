import Peer from 'peerjs';
import 'angular';

export default angular.module('peerjs-service', ['api-key'])
.service('peerJS',
['$q', 'ApiKey', function ($q, apiKey) {
    let peer;

    Object.assign(this, {
        getPeer () {
            if (peer) return $q(resolve => resolve(peer));

            return apiKey.fetch('peerjs').then((key) => {
                peer = new Peer(generateId(), { key });
                return peer;
            });
        },

        destroyPeer () {
            if (!peer) return;
            peer.destroy();
            peer = null;
        }
    });

    function generateId () {
        let length = 5;
        let text = "";
        //let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let possible = "0123456789";

        for(let i = 0; i < length; i++) {
            text += possible.charAt(
                Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}]);
