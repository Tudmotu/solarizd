import 'angular';

export default [function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<div class="sol-tabs"><ng-transclude></ng-transclude></div>',
        scope: {
            selected: '@'
        },
        link: function ($scope, $element, $attrs) {
            $scope.getSelected = function () {
                return parseInt($scope.selected, 10) || 0;
            };
            $scope.applySelection = function () {
                if ($scope.tabs.length) {
                    $scope.tabs.forEach((el) => {
                        el.removeAttribute('selected');
                    });
                    $scope.tabs[$scope.getSelected()].setAttribute('selected', '');
                }
            };

            $scope.tabs = $element.find('[tab-id]').toArray();

            $scope.applySelection();
            $scope.$watch('selected', () => {
                $scope.applySelection();
            });
        }
    };
}];
