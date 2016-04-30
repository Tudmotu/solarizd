import 'angular';

export default ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/modules/notifications/confirmation/confirmation.html',
        scope: {
            namespace: '@'
        },
        link: function ($scope) {
            $scope.$on(`${$scope.namespace}::confirm`, (e, data = {}) => {
                $scope.active = true;

                if (data.text) {
                    $scope.text = data.text;
                }

                if (data.title) {
                    $scope.title = data.title;
                }

                $scope.onConfirm = () => {
                    if (data.onConfirm)
                        data.onConfirm();
                    $scope.active = false;
                };
                $scope.onCancel = () => {
                    if (data.onCancel)
                        data.onCancel();
                    $scope.active = false;
                };
            });
        }
    };
}];
