import 'angular';

export default [function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/modules/notifications/toast/toast.html',
        scope: {
            namespace: '@'
        },
        link: function ($scope) {
            $scope.$on(`${$scope.namespace}::notify`, (e, data) => {
                $scope.active = true;

                if (data) {
                    $scope.text = data.text;
                    $scope.thumb = data.thumb;
                }

                setTimeout(() => {
                    $scope.active = false;
                    if (!$scope.$$phase) $scope.$digest();
                }, 3000);

                if (!$scope.$$phase) $scope.$digest();
            });

            $scope.$on(`${$scope.namespace}::close`, () => {
                $scope.active = false;
                if (!$scope.$$phase) $scope.$digest();
            });
        }
    };
}];
