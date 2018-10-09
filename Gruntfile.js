module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        options: {
          transform: [['babelify', { "presets": ["@babel/preset-env"] }]]
        },
        files: {
          "src/button-bundled.js": 'src/button.js'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/button-bundled.js',
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
      css: ['src/button.css'],
      js: ['src/button-bundled.js'],
    },
  });

  // Load the plugins that provide the "babel" and "uglify" tasks
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['browserify', 'uglify', 'cssmin', 'clean']);
};