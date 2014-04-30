/*global module */

var path = require('path');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        express: {
            server: {
                options: {
                    port: 3000,
                    hostname: 'localhost',
                    bases: [path.resolve('./')]
                }
            }
        },
        watch: {
            html: {
                files: ['src/index.tpl.html'],
                tasks: ['index']
            },
            stylesheets: {
                files: ['src/styles.less'],
                tasks: ['less']
            }
        },
        less: {
            development: {
                files: {
                    'assets/styles.min.css': [
                        'src/styles.less',
                    ]
                },
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    sourceMap: true,
                    sourceMapFilename: "assets/styles.css.map",
                    sourceMapBasepath: "",
                    sourceMapRootpath: "../"
                }
            }
        },
        index: {
            build: {
               tpl: './src/index.tpl.html',
                out: './index.html'
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'vendor/barrita/dist/',
                src: '**',
                dest: 'assets/barrita/',
                flatten: true,
                filter: 'isFile'
            }
        },
        clean: ["index.html", "assets"]
    });

    grunt.registerMultiTask( 'index', 'Process index.html template', function () {
      grunt.file.copy(this.data.tpl, this.data.out, { 
        process: function ( contents, path ) {
            grunt.log.writeln("Processing index.html");

            return grunt.template.process( contents, {
                data: {
                    pkg: grunt.config( 'pkg' ),
                    pkgBarrita: grunt.file.readJSON('vendor/barrita/package.json')
                }
            });
        }
      });
    });

    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['build', 'express', 'watch', 'express-keepalive']);
    grunt.registerTask('build', ['clean','less', 'copy', 'index']);
};