import 'angular';
var hasVibrate = typeof window.navigator.vibrate === 'function';
var VIBE_LENGTH = 100;

export default angular.module('solVibrate', [])
    .directive('solVibrate', [function() {
        var definitions = {
            restrict: 'AC',
            scope: false,
            link: function($scope, $element, $attrs, $transclude) {
                if ($attrs.solVibrate !== '') {
                    $scope.$watch($attrs.solVibrate, function(value, prev) {
                        if (value === true)
                            navigator.vibrate(VIBE_LENGTH);
                    });
                } else if (hasVibrate) {
                    $element[0].addEventListener('touchstart', function(e) {
                        navigator.vibrate(VIBE_LENGTH);
                    });
                }
            }
        };

        return definitions;
    }]);
