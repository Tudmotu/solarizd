module.exports = function(config) {
    config.set({
        frameworks: [
            'jasmine-jquery',
            'jasmine',
            'jasmine-matchers',
            'browserify',
            'source-map-support'
        ],

        reporters: ['dots'],

        files: [
            'src/js/Application.js',
            'src/modules/**/*.html',
            'src/html/**/*.html',
            'src/test/**/*.js'
        ],

        exclude: [
            'src/test/mocks.js',
            'src/test/test-main.js'
        ],

        preprocessors: {
            'src/modules/**/*.html': ['ng-html2js'],
            'src/html/**/*.html': ['ng-html2js'],
            'src/js/Application.js': ['browserify'],
            'src/test/**/*.js': ['browserify']
        },

        ngHtml2JsPreprocessor: {
            // strip this from the file path
            cacheIdFromPath: function (path) {
                var newPath = path.replace(/^src/, '');
                console.log('Processing template', newPath);
                return newPath;
            },

            // the name of the Angular module to create
            moduleName: "karma.templates"
        },

        browserify: {
            debug: true
            //debug: true,
            //transform: [
                //['babelify', { compact: 'none' }],
                //['browserify-shim']
            //]
        },

        browsers: ['Chrome']
    });
};
