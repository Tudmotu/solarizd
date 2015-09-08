import 'angular';

export default [function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/modules/ui-kit/sol-input/sol-input.html',
        scope: {
            icon: '@',
            placeholder: '@',
            value: '='
        },
        link: ($scope, $element) => {
            Object.assign($scope, {
                getIconClass: () => {
                    if (!$scope.value)
                        return $scope.icon;
                    else
                        return 'remove';
                },
                clear: () => {
                    $scope.value = '';
                }
            });
        }
    };
}];
