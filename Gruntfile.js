/*global module */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower: {
            install: {
                options: {
                    targetDir: 'vendor'
                }
            }
        },

        less: {
            production: {
                files: {
                    'dist/barrita.min.css': [
                        'src/barrita.less',
                    ]
                },
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                }
            },
            development: {
                files: {
                    'dist/barrita.min.css': [
                        'src/barrita.less',
                    ]
                },
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    sourceMap: true,
                    sourceMapFilename: "dist/barrita.css.map",
                    sourceMapBasepath: "",
                    sourceMapRootpath: "../"
                }
            }
        },

        watch: {
            stylesheets: {
                files: ['src/barrita.less'],
                tasks: ['less']
            },
            jsapp: {
                files: ['src/barrita.js'],
                tasks: ['jshint', 'uglify']
            }
        },

        jshint: {
            all: ['src/barrita.js'],
            /* 
                IMPORTANT: Don't change these rules unless it was absolutely necessary 
            */
            options: {
                "indent": 4,
                "curly": true,
                "eqnull": true,
                "eqeqeq": true,
                "undef": true,
                "browser": true,
                "newcap" : true,
                "noempty": true,
                "nonbsp": true,
                "quotmark": "single",
                "trailing": true,
                "maxparams": 3,
                "maxdepth": 2,
                "maxstatements": 15,
                "maxcomplexity": 6
            }
        },

        uglify: {
            production: {
                options: {
                    compress: {
                        drop_console: true
                    },
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - Build: <%= grunt.template.today("yyyy-mm-dd") %> \nCopyright (c) 2014 <%= pkg.author %> \nLicensed under the MIT License */\n'
                },
                files: {
                    'dist/barrita.min.js': ['src/barrita.js']
                }
            },
            development: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'dist/barrita.map'
                },
                files: {
                    'dist/barrita.min.js': ['src/barrita.js']
                }
            }
        },

        clean: ["dist/*"]
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('build', ['clean', 'jshint', 'less:production', 'uglify:production']);
    grunt.registerTask('default', ['clean', 'jshint', 'less:development', 'uglify:development', 'watch']);
};