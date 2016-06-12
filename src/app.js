import 'babel-polyfill';
import MobileDetect from 'mobile-detect';
import Appliction from './js/Application';
import 'jquery-ui-touch-punch';

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

if (document.readyState === 'complete') {
    bootstrapAngular();
} else {
    window.addEventListener('load', bootstrapAngular, false);
}
