import 'angular';

export default [function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        //template: '<div class="sol-tabs"><header class="tabs"><span class="tab" ng-repeat="tab in tabs"></span></header><section class="wrapper"><ng-transclude></ng-transclude></section></div>',
        templateUrl: '/modules/ui-kit/sol-tabs/sol-tabs.html',
        scope: {
            selected: '@'
        },
        link: function ($scope, $element, $attrs) {
            $scope.getSelected = function () {
                return parseInt($scope.selected, 10) || 0;
            };

            $scope.applySelection = function () {
                if ($scope.tabs.length) {
                    $scope.tabs.forEach((tab) => {
                        tab.$el.removeAttribute('selected');
                    });
                    $scope.tabs[$scope.getSelected()].$el.setAttribute('selected', '');
                }
            };

            $scope.tabs = $element.find('[tab-id]').toArray().map((o) => {
                return {
                    id: o.getAttribute('tab-id'),
                    title: o.getAttribute('tab-title'),
                    $el: o
                };
            });

            $scope.applySelection();
            $scope.$watch('selected', () => {
                $scope.applySelection();
            });
        }
    };
}];
