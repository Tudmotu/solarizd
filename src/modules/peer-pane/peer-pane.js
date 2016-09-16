export default angular.module('peer-pane', ['sol-peerjs', 'peerjs-service'])
.directive('peerPane',
        ['solPeer', 'peerJS', (solPeer, peerJS) => {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/modules/peer-pane/peer-pane.html',
        scope: {},
        link: ($scope, $element) => {
            Object.assign($scope, {
                showHostPanel:false,
                showConnectPanel: false,
                remotePeer: localStorage.peerjsRemotePeer,

                isValidId () {
                    return peerJS.isValidId(this.remotePeer);
                },

                toggleHost () {
                    this.showHostPanel = !this.showHostPanel;

                    if (this.showHostPanel)
                        solPeer.createServer();
                    else
                        solPeer.destroyPeer();
                },
                toggleConnection () {
                    this.showConnectPanel = !this.showConnectPanel;
                },
                connectToHost () {
                    if (this.remotePeer) {
                        this.connectStatus = 'connecting';
                        solPeer.connectToServer(this.remotePeer).then(() => {
                            this.connectStatus = 'connected';
                            localStorage.peerjsRemotePeer = this.remotePeer;
                        }).catch(() => {
                            this.connectStatus = 'connection-error';
                        });
                    }
                },
                disconnectFromHost () {
                    solPeer.disconnectFromServer();
                    this.connectStatus = 'disconnected';
                    delete localStorage.peerjsRemotePeer;
                }
            });

            if ($scope.isValidId()) {
                $scope.connectToHost();
            }

            $scope.$watch(
                () => solPeer.peerId,
                (peerId) => $scope.peerId = peerId);

            $scope.$watch(
                solPeer.isConnectedToHost,
                (isConnected) => $scope.isConnected = isConnected);
        }
    };
}]);
