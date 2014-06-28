requirejs.config({
    baseUrl : '.',
    paths   : {
        'lib'               : 'vendor',
        'modules'           : 'js',
        'template_dir'      : 'html',
        'angular'           : 'vendor/angular/angular',
        'ng-resource'       : 'vendor/ng-resource/dist/ng-resource',
        'ui-sortable'       : 'vendor/angular-ui-sortable/sortable.min',
        'jquery-ui-core'    : 'vendor/jquery-ui/ui/minified/jquery.ui.core.min',
        'jquery-ui-widget'  : 'vendor/jquery-ui/ui/minified/jquery.ui.widget.min',
        'jquery-ui-mouse'   : 'vendor/jquery-ui/ui/minified/jquery.ui.mouse.min',
        'jquery-ui-sortable': 'vendor/jquery-ui/ui/minified/jquery.ui.sortable.min',
        'jquery'            : 'vendor/jquery/dist/jquery.min',
        'jqui-touch-punch'  : 'vendor/jquery-ui-touch-punch/jquery.ui.touch-punch.min',
        'text'              : 'vendor/requirejs-text/text'
    },
    shim    : {
        'angular': {
            deps: ['jquery']
        },
        'ng-resource': {
            deps: ['angular']
        },
        'ui-sortable': {
            deps: ['angular', 'jqui-touch-punch', 'jquery-ui-core', 'jquery-ui-widget', 'jquery-ui-mouse', 'jquery-ui-sortable']
        },
        'jquery-ui-core': {
            deps: ['jquery']
        },
        'jqui-touch-punch': {
            deps: ['jquery-ui-widget', 'jquery-ui-mouse']
        }
    }
});

requirejs([
    'modules/Application',
    'vendor/mobile-detect/mobile-detect',
    'angular'
], function (Appliction) {
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
