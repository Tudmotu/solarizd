module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'requirejs'],

    files: [
      {pattern: 'src/ui/**/*.js', included: false},
      {pattern: 'src/js/**/*.js', included: false},
      {pattern: 'src/html/**/*.html', included: false},
      {pattern: 'src/vendor/**/*.js', included: false},
      {pattern: 'test/**/*.js', included: false},

      'test/test-main.js'
    ],

    exclude: [
        'src/app.js'
    ],

    browsers: ['Chrome']
  });
};
