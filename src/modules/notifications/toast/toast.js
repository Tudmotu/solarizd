import 'angular';

export default ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/modules/notifications/toast/toast.html',
        scope: {
            namespace: '@'
        },
        link: function ($scope) {
            $scope.$on(`${$scope.namespace}::notify`, (e, data) => {
                $timeout(() => {
                    $scope.active = true;

                    if (data) {
                        $scope.text = data.text;
                        $scope.thumb = data.thumb;
                    }

                    $timeout(() => {
                        $scope.active = false;
                    }, 3000);
                });
            });

            $scope.$on(`${$scope.namespace}::close`, () => {
                $timeout(() => {
                    $scope.active = false;
                });
            });
        }
    };
}];
