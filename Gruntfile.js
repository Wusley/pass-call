module.exports = function( grunt ) {

    'use strict';

    grunt.initConfig( {

        pkg: grunt.file.readJSON( 'package.json' ),
        shell: {

            'server-start-dev': {

                options: {
                    stdout: true
                },
                command: 'pm2 start server.js -x'

            },
            'server-start-prod': {

                options: {
                    stdout: true
                },
                command: 'pm2 start server.js -x'

            },
            'server-restart': {

                options: {
                    stdout: true
                },
                command: 'pm2 restart server.js -x'

            }

        },
        compass: {

            dev: {

                options: {
                    sassDir:        'resources/sass',
                    cssDir:         'resources/css',
                    imagesDir:      'resources/images',
                    relativeAssets: true,
                    outputStyle:    'expanded'
                }

            },
            prod: {

                options: {
                    sassDir:        'resources/sass',
                    cssDir:         'resources/css',
                    imagesDir:      'resources/images/',
                    fontDir:        'resources/fonts',
                    relativeAssets: true,
                    outputStyle:    'compressed'
                }

            }

        },
        uglify: {
            target: {

                files: [ {
                    expand: true,
                    cwd: 'resources/js/src/main',
                    src: '**/*.js',
                    dest: 'resources/js/build'
                } ]

            }
        },
        nodeunit: {

            client: [
                'resources/js/src/test/**/*.js'
            ],
            server: [
                'src/test/**/*.js',
            ]

        },
        csslint: {

            options: {
                csslintrc: '.csslintrc'
            },
            src: [ 'resources/css/**/*.css' ]

        },
        jshint: {

            options: {
                jshintrc: '.jshintrc'
            },
            client: [
                'resources/js/main.js',
                'resources/js/config/**/*.js',
                'resources/js/modules/**/*.js',
                'resources/js/utils/**/*.js'
            ],
            server: [
                'src/main/**/*.js'
            ]

        },
        watch: {

            css: {

                files: [ 'resources/sass/**/*' ],
                tasks: 'css'

            },
            'js-client': {

                files: [ 'resources/js/src/main/**/*'],
                tasks: 'js-client'

            },
            'js-server': {
            	files: [ 'src/main/**/*'],
                tasks: 'js-server'
            }

        },
        clean: {

            css: {

                src: [ 'resources/css/**/*' ]

            },
            'js-client': {

                src: [ 'resources/js/build/**/*' ]

            }

        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.url %>',
                options: {
                    paths: 'resources/js/src/',
                    outdir: 'resources/docs/'
                }
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-connect' );
    grunt.loadNpmTasks( 'grunt-contrib-compass' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-csslint' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-yuidoc' );
    grunt.loadNpmTasks( 'grunt-contrib-nodeunit' );
    grunt.loadNpmTasks( 'grunt-shell' );

    /*
	* Watch
	*/
    grunt.registerTask( 'watchs', [ 'watch:css', 'watch:js-client', 'watch:js-server' ] );

    /*
	* CSS
	*/
    grunt.registerTask( 'css', [ 'clean:css', 'compass:dev', 'csslint' ] );

    /*
	* JS
	*/
    grunt.registerTask( 'js-client', [ 'clean:js-client', 'jshint:client', 'nodeunit:client' ] );
    grunt.registerTask( 'js-server', [ 'jshint:server', 'nodeunit:server', 'shell:server-restart' ] );

    /*
    * Development
    */
    grunt.registerTask( 'run-dev', [
    	'css',
    	'js-client',
    	'js-server',
    	'watchs',
    	'shell:server-start-dev'
    ] );

    /*
    * Production
    */
    grunt.registerTask( 'run-prod', [
        'clean:css',
        'compass:prod',
        'csslint',
        'js-client',
        'js-server',
        'uglify:target',
        'shell:server-start-prod'
    ] );

    /*
    * Documentation
    */
    grunt.registerTask( 'doc', [ 'yuidoc:compile' ] );

    grunt.registerTask( 'st', [ 'shell:start' ] );
};