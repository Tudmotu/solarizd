export default angular.module('peer-pane', ['sol-peerjs'])
.directive('peerPane',
        ['solPeer', (solPeer) => {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/modules/peer-pane/peer-pane.html',
        scope: {},
        link: ($scope, $element) => {
            Object.assign($scope, {
                showHostPanel:false,
                showConnectPanel: false,

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
                    if (this.remotePeer)
                        solPeer.connectToServer(this.remotePeer);
                },
                disconnectFromHost () {
                    solPeer.disconnectFromServer();
                }
            });

            $scope.$watch(
                () => solPeer.peerId,
                (peerId) => $scope.peerId = peerId);

            $scope.$watch(
                solPeer.isConnectedToHost,
                (isConnected) => $scope.isConnected = isConnected);
        }
    };
}]);
