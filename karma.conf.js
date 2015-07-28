module.exports = function(config) {
    config.set({
        frameworks: ['jasmine', 'browserify'],

        files: [
            'src/test/**/*.js',
        ],

        exclude: [
            'src/test/mocks.js',
            'src/test/test-main.js'
        ],

        preprocessors: {
            "src/test/**/*.js": ["browserify"]
        },

        browserify: {
            debug: true,
            transform: [
                ['babelify', {stage: 0}]
            ]
        },

        browsers: ['Chrome']
    });
};
