import Peer from 'peerjs';
import 'angular';

export default angular.module('sol-peerjs', ['api-key'])
.service('solPeer',
['$q', 'ApiKey', '$rootScope', function ($q, apiKey, $rootScope) {
    let peer;

    Object.assign(this, {
        createServer () {
            //this.init().then((peer) => {

            //});
        },

        connectToServer () {
            //this.init().then((peer) => {

            //});
        }
    });
}]);
