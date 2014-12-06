module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    replace: {
      debug: {
        src: ['src/soop.js'],
        dest: 'build/soop.js',
        replacements: [{
          from: /\/\/<debug>[\s\S]*?\/\/<\/debug>/gi,
          to: ''
        }]
      }
    },

    uglify: {
      options: {
        compress: {
          hoist_vars: true
        }
      },
      build: {
        files: {
          'build/soop.js': ['build/soop.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['replace','uglify']);
};
