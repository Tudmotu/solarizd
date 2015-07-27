requirejs.config({
    baseUrl : '.',
    paths   : {
        'template_dir'      : 'html',
        'text'              : './vendor/requirejs-text/text'
    },
    shim    : {
        'vendor/angular/angular': {
            deps: ['vendor/jquery/dist/jquery']
        },
        'vendor/ng-resource/dist/ng-resource': {
            deps: ['vendor/angular/angular']
        },
        'vendor/angular-ui-sortable/sortable': {
            deps: [
                'vendor/angular/angular',
                'vendor/jquery-ui-touch-punch/jquery.ui.touch-punch',
                'vendor/jquery-ui/ui/jquery.ui.sortable']
        },
        'vendor/jquery-ui/ui/jquery.ui.sortable': {
            deps: ['vendor/jquery-ui/ui/jquery.ui.mouse']
        },
        'vendor/jquery-ui/ui/jquery.ui.mouse': {
            deps: ['vendor/jquery-ui/ui/jquery.ui.widget']
        },
        'vendor/jquery-ui/ui/jquery.ui.widget': {
            deps: ['vendor/jquery-ui/ui/jquery.ui.core']
        },
        'vendor/jquery-ui/ui/jquery.ui.core': {
            deps: ['vendor/jquery/dist/jquery']
        },
        'vendor/jquery-ui-touch-punch/jquery.ui.touch-punch': {
            deps: ['vendor/jquery-ui/ui/jquery.ui.widget', 'vendor/jquery-ui/ui/jquery.ui.mouse']
        }
    }
});

requirejs([
    './js/Application',
    './vendor/mobile-detect/mobile-detect',
    './vendor/ng-resource/dist/ng-resource',
    './vendor/angular/angular'
], function (Appliction, MobileDetect) {
    console.debug(Appliction);
    function bootstrapAngular () {
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
        window.applicationCache.addEventListener('updateready', function () {
            window.location.reload();
        });
    }

    if (document.readyState === 'complete') {
        bootstrapAngular();
    }
    else {
        window.addEventListener('load', bootstrapAngular, false);
    }
});
