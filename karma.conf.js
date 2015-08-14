module.exports = function(config) {
    config.set({
        frameworks: ['jasmine', 'browserify'],

        files: [
            'src/vendor/jquery/dist/jquery.js',
            'src/vendor/angular/angular.js',
            'src/modules/**/*.*',
            'src/test/**/*.js'
        ],

        exclude: [
            'src/test/mocks.js',
            'src/modules/**/*.js',
            'src/test/test-main.js'
        ],

        preprocessors: {
            'src/modules/**/*.html': ['ng-html2js'],
            'src/test/**/*.js': ['browserify']
        },

        ngHtml2JsPreprocessor: {
            // strip this from the file path
            cacheIdFromPath: function (path) {
                var newPath = path.replace(/^src/, '');
                console.log('path', path);
                console.log('new path', newPath);
                return newPath;
            },

            // the name of the Angular module to create
            moduleName: "karma.templates"
        },

        browserify: {
            debug: true,
            transform: [
                ['babelify', { compact: 'none' }],
                ['browserify-shim']
            ]
        },

        browsers: ['Chrome']
    });
};
