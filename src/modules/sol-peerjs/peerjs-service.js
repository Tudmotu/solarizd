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
                console.debug('fetched key', key);
                peer = new Peer({ key });
                return peer;
            });
        }
    });
}]);
