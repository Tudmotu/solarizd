define([
    'text!template_dir/panel-switcher/bar.html',
    './directives/sol-vibrate',
    '../vendor/angular/angular'
], function (BarTemplate) {
    return angular.module('ui.panel-switcher', ['services', 'solVibrate'])
            .directive('panelSwitcher', ['playList', function (playList) {
                var definitions = {
                        restrict: 'E',
                        template: BarTemplate,
                        replace: true,
                        scope: true,
                        controller: function ($scope, $element, $attrs, $transclude) {
                            $scope.switch = function (elId, name) {
                                var curPanels = document.querySelectorAll('#main-view > .current-panel'),
                                    curLabel = $element[0].querySelector('.active'),
                                    newLabel = $element[0].querySelector('[data-name="' + name + '"]');
                                Array.prototype.forEach.call(curPanels, function (el) {
                                    el.classList.remove('current-panel');
                                });

                                document.getElementById(elId).classList.add('current-panel');

                                if (curLabel)
                                    curLabel.classList.remove('active');
                                if (newLabel)
                                    newLabel.querySelector('.title').classList.add('active');
                            };

                            $scope.$on('setCurrentView', function (e, view) {
                                if (view === 'playlist') {
                                    $scope.switch('playlist-pane', 'playlist');
                                }
                                else {
                                    $scope.switch('search-pane', 'search');
                                }
                            });
                        }
                    };

                return definitions;
            }]);
});
