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
        requirejs: {
            build: {
                options: {
                    baseUrl: 'src/',
                    mainConfigFile: 'src/<%= fileNames.js %>',
                    name: 'app',
                    out: 'target/<%= fileNames.js %>',
                    optimize: 'none' // FIXME: something with angular's DI
                }
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
                        src: 'src/vendor/requirejs/require.js',
                        dest: 'target/vendor/requirejs/require.js'
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-targethtml');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', [
        'copy:build',
        'targethtml:build',
        'less:build',
        'autoprefixer:build',
        'cssmin:build',
        'requirejs:build',
        'clean:build'
    ]);
};
