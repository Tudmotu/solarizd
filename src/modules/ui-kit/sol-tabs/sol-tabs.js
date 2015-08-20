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
                }
            });

            $scope.$watch('selected', (selected) => {
                selected = parseInt(selected, 10) || 0;

                if ($scope.tabs.length) {
                    $scope.tabs.forEach((tab) => {
                        tab.$el.removeAttribute('selected');
                    });

                    $scope.tabs[selected].$el.setAttribute('selected', '');
                }
            });
        }
    };
}];
