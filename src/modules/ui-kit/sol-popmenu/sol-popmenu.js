export default [() => {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: '/modules/ui-kit/sol-popmenu/sol-popmenu.html',
        scope: {
            icon: '@'
        },
        //link: function ($scope, $element, $attrs) {
        //}
    };
}];
