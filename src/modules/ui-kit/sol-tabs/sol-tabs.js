import 'angular';

export default [function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: '/modules/ui-kit/sol-tabs/sol-tabs.html',
        scope: {
            selected: '@'
        },
        link: function ($scope, $element, $attrs) {
            Object.assign($scope, {
                get tabs () {
                    return $element.find('[tab-id]').toArray().map((o) => {
                        return {
                            id: o.getAttribute('tab-id'),
                            title: o.getAttribute('tab-title'),
                            icon: o.getAttribute('tab-icon'),
                            $el: o
                        };
                    });
                },
                select: (selected) => {
                    $scope.selected = selected;
                },
                getIconClass: (icon) => {
                    if (!!icon)
                        return 'fa fa-' + icon;

                    return '';
                },
                applySelection: () => {
                    let selected = parseInt($scope.selected, 10) || 0;

                    if ($scope.tabs.length) {
                        $scope.tabs.forEach((tab) => {
                            $element.find(`[tab-id="${tab.id}"]`)[0].removeAttribute('selected');
                        });

                        let selectedId = $scope.tabs[selected].id;
                        $element.find(`[tab-id="${selectedId}"]`)[0].setAttribute('selected', '');
                    }
                }
            });

            new MutationObserver($scope.applySelection)
                    .observe($element.find('[ng-transclude]')[0], {
                childList: true
            });

            $scope.$watch('selected', $scope.applySelection);
        }
    };
}];
