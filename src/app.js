requirejs.config({
    baseUrl : '.',
    paths   : {
        'lib'           : 'vendor',
        'modules'       : 'js',
        'template_dir'  : 'html',
        'angular'       : 'vendor/angular/angular',
        'ng-resource'   : 'vendor/ng-resource/dist/ng-resource',
        'text'          : 'vendor/requirejs-text/text'
    },
    shim    : {
        'ng-resource': {
            deps: ['angular']
        }
    }
});

requirejs([
    'modules/Application',
    'angular'
], function (Appliction) {
    function bootstrapAngular () {
        var htmlElem = document.getElementsByTagName('html')[0],
            contentElem = document.getElementById('content');
        
        angular.bootstrap(htmlElem, ['Application']);
    }

    if (document.readyState === 'complete') {
        bootstrapAngular();
    }
    else {
        window.addEventListener('load', bootstrapAngular, false);
    }
});
