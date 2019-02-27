module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        options: {
          transform: [
            ['babelify', { 
              presets: [
                ["@babel/preset-env", {
                  targets: {
                    browsers: ["last 1 version", "ie>=11" ]
                  }
                }]
              ]
            }]
          ]
        },
        files: {
          "public/button-bundled.js": 'src/button.js'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'public/button-bundled.js',
        dest: 'public/button.js'
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'src/css',
          src: ['*.css'],
          dest: 'public/css',
        }]
      }
    },
    clean: {
      js: ['public/button-bundled.js']
    }
  });

  // Load the plugins that provide the "cssmin" and "uglify" tasks
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['browserify','uglify', 'cssmin','clean']);
};