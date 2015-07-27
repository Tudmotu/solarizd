import Appliction from './js/Application';
import MobileDetect from './vendor/mobile-detect/mobile-detect';
import './vendor/ng-resource/dist/ng-resource';
import './vendor/angular/angular';

function bootstrapAngular() {
    var htmlElem = document.getElementsByTagName('html')[0],
        contentElem = document.getElementById('content');

    angular.bootstrap(htmlElem, ['Application']);
}

// Hack preventing virtual keyboard from screwing styling
var md = new MobileDetect(window.navigator.userAgent);
if (md.mobile() !== null) {
    document.body.style.minHeight = document.body.clientHeight + 'px';
}

// Auto-reload when appcache updates
if (window.hasOwnProperty('applicationCache')) {
    window.applicationCache.addEventListener('updateready', function() {
        window.location.reload();
    });
}

if (document.readyState === 'complete') {
    bootstrapAngular();
} else {
    window.addEventListener('load', bootstrapAngular, false);
}
