import 'angular';

export default [function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<div class="sol-tabs"><ng-transclude></ng-transclude></div>'
    };
}];
