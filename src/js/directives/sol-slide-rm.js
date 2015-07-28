import cssPrefix from '../lib/css-prefix';
import 'angular';

function translateElement(el, movement) {
    var prefixedProp = cssPrefix('transform'),
        transform = movement > 0 ?
        'translate3d(' + movement + 'px,0,0)' : '';

    el.style[prefixedProp] = transform;
    el.style.transform = transform;
}

function animateSlideOff(el, progress, width, callback) {
    var x0 = progress * width,
        dt = 0,
        animDuration = 250,
        v = (width - x0) / animDuration,
        intervalId;

    intervalId = setInterval(function() {
        var translation = x0 + v * dt;

        translateElement(el, translation);

        if (dt >= animDuration) {
            clearInterval(intervalId);
            callback();
        } else
            dt += 16;
    }, 16);
}

export default angular.module('solSlideRm', [])
    .directive('solSlideRm', [function() {
        var definitions = {
            restrict: 'AC',
            scope: false,
            link: function($scope, $element, $attrs, $transclude) {
                var touchStartX = null,
                    touchSlideProgress = null,
                    shouldPreventEnd = false,
                    handle = $element[0].querySelector($attrs.solSlideRmHandle),
                    el = (handle || $element[0]),
                    threshAttr = $attrs.solSlideRmThreshold,
                    threshold = parseFloat(threshAttr, 10) || 0.2;

                el.addEventListener('touchstart', function(e) {
                    var touch = e.touches[0];
                    touchStartX = touch.screenX;
                    touchStartY = touch.screenY;

                    e.stopPropagation();
                });

                el.addEventListener('touchmove', function(e) {
                    var touch = e.touches[0],
                        movement = touch.screenX - touchStartX,
                        rect = $element[0].getBoundingClientRect();

                    if (touchStartX && movement >= 0) {
                        touchSlideProgress = movement / rect.width;
                        translateElement($element[0], movement);
                        shouldPreventEnd = true;

                        // Stop propagation only if move is on item
                        // If touch point is outside of item (plus buffer),
                        // do not prevent scrolling
                        if (touch.screenY < touchStartY + rect.height &&
                            touch.screenY > touchStartY - rect.height) {
                            e.stopPropagation();
                            e.preventDefault();
                        } else {
                            onTouchEnd(e, /*dont remove item*/ true);
                        }
                    }
                });

                el.addEventListener('touchend', onTouchEnd);

                function onTouchEnd(e, dontRemove) {
                    var rect = $element[0].getBoundingClientRect();

                    // When threshold is passed we slide the item off and
                    // remove it from the model.
                    if (dontRemove !== true && touchSlideProgress >= threshold) {
                        animateSlideOff($element[0], touchSlideProgress, rect.width, function() {
                            $scope.$parent.$eval(function($parentScope) {
                                var model = $parentScope[$attrs.solSlideRm];

                                if (Array.isArray(model)) {
                                    model.splice($scope.$index, 1);
                                    if (!$parentScope.$$phase) $parentScope.$digest();

                                    if ($attrs.solSlideRmAfter)
                                        $parentScope.$eval($attrs.solSlideRmAfter);
                                }

                                // Should bring back original el, as angular
                                // re-uses that node
                                translateElement($element[0], '');
                            });
                        });
                    } else {
                        translateElement($element[0], '');
                    }

                    touchStartX = null;
                    touchStartY = null;
                    touchSlideProgress = null;

                    e.stopPropagation();

                    if (shouldPreventEnd) {
                        shouldPreventEnd = false;
                        e.preventDefault();
                    }
                }
            }
        };

        return definitions;
    }]);

