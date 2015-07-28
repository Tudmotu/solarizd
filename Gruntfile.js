module.exports = function (grunt) {
    grunt.initConfig({
        fileNames: {
            js   : 'app.js',
            less : 'style.less',
            html : 'index.html',
            css  : 'style.css',
            unprefixedCss: 'style.up.css',
            unminCss: 'style.nonmin.css'
        },
        less: {
            build: {
                src: 'src/<%= fileNames.less %>',
                dest: 'target/<%= fileNames.unprefixedCss %>'
            } 
        },
        autoprefixer: {
            build: {
                src: 'target/<%= fileNames.unprefixedCss %>',
                dest: 'target/<%= fileNames.unminCss %>' 
            }
        },
        cssmin: {
            build: {
                src: 'target/<%= fileNames.unminCss %>',
                dest: 'target/<%= fileNames.css %>' 
            }
        },
        copy: {
            build: {
                files: [
                    {
                        expand : true,
                        cwd    : 'src/',
                        src    : ['css/assets/**'],
                        dest   : 'target/',
                        filter : 'isFile'
                    },
                    {
                        expand : true,
                        cwd    : 'src/',
                        src    : ['css/fonts/**'],
                        dest   : 'target/',
                        filter : 'isFile'
                    },
                    {
                        expand : true,
                        cwd    : 'src/',
                        src    : ['vendor/fontawesome/fonts/**'],
                        dest   : 'target/',
                        filter : 'isFile'
                    },
                    {
                        expand : true,
                        cwd    : 'src/',
                        src    : ['html/**'],
                        dest   : 'target/',
                        filter : 'isFile'
                    },
                    {
                        expand : true,
                        cwd    : 'src/',
                        src    : ['js/assets/**'],
                        dest   : 'target/',
                        filter : 'isFile'
                    },
                    {
                        src    : 'src/apikeys.json',
                        dest   : 'target/apikeys.json'
                    }
                ]
            }
        },
        clean: {
            build: ['target/style.*.css']
        },
        targethtml: {
            build: {
                src: 'src/<%= fileNames.html %>',
                dest: 'target/<%= fileNames.html %>',
            }
        },
        connect: {
            src: {
                options: {
                    hostname: '*',
                    port: 9000,
                    base: 'src',
                    debug: true,
                    keepalive: true
                }
            },
            target: {
                options: {
                    hostname: '*',
                    port: 9000,
                    base: 'target',
                    debug: true,
                    keepalive: true
                }
            }
        },
        manifest: {
            build: {
                options: {
                    basePath     : 'target/',
                    cache        : [
                        'vendor/fontawesome/fonts/fontawesome-webfont.eot?v=',
                        'vendor/fontawesome/fonts/fontawesome-webfont.svg?v=',
                        'vendor/fontawesome/fonts/fontawesome-webfont.ttf?v=',
                        'vendor/fontawesome/fonts/fontawesome-webfont.woff?v=',
                        'apikeys.json'
                    ],
                    exclude      : ['manifest.appcache'],
                    preferOnline : true,
                    verbose      : false,
                    timestamp    : false,
                    hash         : true
                },
                src: [
                    '**/*'
                ],
                dest: 'target/manifest.appcache'
            }
        },
        browserify: {
            build: {
                options: {
                    transform: [["babelify", { "stage": 0 }]]
                },
                files: {
                    "target/app.js": "src/app.js"
                }
            }
        },
        karma: {
            dev: {
                configFile: 'karma.conf.js',
                browsers: ['Chrome']
            },
            test: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['Chrome']
            },
            ci: {
                configFile: 'karma.conf.js',
                singleRun: true,
                reporters: ['dots', 'junit'],
                junitReporter: {
                    outputDir: 'test-reports',
                    outputFile: 'test-results.xml'
                },
                browsers: ['PhantomJS']
            }
        },
        jshint: {
            options: {
                esnext: true
            },
            all: [
                'src/js/**/*.js',
                'src/ui/**/*.js'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-targethtml');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-manifest-ext');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('test', [
        'jshint:all',
        'karma:ci'
    ]);

    grunt.registerTask('build', [
        'copy:build',
        'targethtml:build',
        'less:build',
        'autoprefixer:build',
        'cssmin:build',
        'browserify:build',
        'clean:build',
        'manifest:build'
    ]);

    grunt.registerTask('release', [
        'test',
        'build'
    ]);
};
