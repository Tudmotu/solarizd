var tests = [];
for (var file in window.__karma__.files) {
    if (/^\/base\/test\/.*Test\.js$/.test(file)) {
        tests.push(file);
    }
}

requirejs.config({
    baseUrl : '/base/src',
    paths   : {
        'lib'               : 'vendor',
        'modules'           : 'js',
        'template_dir'      : 'html',
        'angular-mocks'     : 'vendor/angular-mocks/angular-mocks',
        'angular'           : 'vendor/angular/angular',
        'ng-resource'       : 'vendor/ng-resource/dist/ng-resource',
        'ui-sortable'       : 'vendor/angular-ui-sortable/sortable.min',
        'jquery-ui-core'    : 'vendor/jquery-ui/ui/minified/jquery.ui.core.min',
        'jquery-ui-widget'  : 'vendor/jquery-ui/ui/minified/jquery.ui.widget.min',
        'jquery-ui-mouse'   : 'vendor/jquery-ui/ui/minified/jquery.ui.mouse.min',
        'jquery-ui-sortable': 'vendor/jquery-ui/ui/minified/jquery.ui.sortable.min',
        'jquery'            : 'vendor/jquery/dist/jquery.min',
        'jqui-touch-punch'  : 'vendor/jquery-ui-touch-punch/jquery.ui.touch-punch.min',
        'google-plus-signin': 'vendor/angular-directive.g-signin/google-plus-signin',
        'text'              : 'vendor/requirejs-text/text'
    },
    shim    : {
        'modules/Application': {
            deps: ['angular-mocks']
        },
        'angular': {
            deps: ['jquery']
        },
        'angular-mocks': {
            deps: ['angular']
        },
        'ng-resource': {
            deps: ['angular']
        },
        'google-plus-signin': {
            deps: ['angular']
        },
        'ui-sortable': {
            deps: ['angular', 'jqui-touch-punch', 'jquery-ui-core', 'jquery-ui-widget', 'jquery-ui-mouse', 'jquery-ui-sortable']
        },
        'jquery-ui-sortable': {
            deps: ['jquery-ui-mouse']
        },
        'jquery-ui-mouse': {
            deps: ['jquery-ui-widget']
        },
        'jquery-ui-core': {
            deps: ['jquery']
        },
        'jqui-touch-punch': {
            deps: ['jquery-ui-widget', 'jquery-ui-mouse']
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
