import 'angular';

export default [function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/modules/ui-kit/sol-input/sol-input.html',
        scope: {
            icon: '@',
            placeholder: '@',
            onFocus: '&',
            onBlur: '&',
            value: '='
        },
        link: ($scope, $element) => {
            Object.assign($scope, {
                getIconClass () {
                    if (!$scope.value)
                        return $scope.icon;
                    else
                        return 'remove';
                },
                setFocus () {
                    $element.find('.input').focus();
                },
                clear () {
                    $scope.value = '';
                }
            });
        }
    };
}];
