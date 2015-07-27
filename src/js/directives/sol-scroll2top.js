define([
    '../../vendor/angular/angular'
], function () {
    return angular.module('solScroll2top', [])
    .directive('solScroll2top', [function () {
        var definitions = {
                restrict: 'AC',
                scope: false,
                link: function ($scope, $element, $attrs, $transclude) {
                    if ($attrs.solScroll2top !== '') {
                        $scope.$watch($attrs.solScroll2top, function (value, prev) {
                            $element.scrollTop(0);
                        });
                    }
                }
            };

        return definitions;
    }]);
});
