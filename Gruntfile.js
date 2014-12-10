module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      scripts: {
        files: ['**/*.js'],
        tasks: ['jasmine_node'],
        options: {
          interrupt: true
        }
      }
    },

    jasmine_node: {
      all: ['spec/']
    },

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

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', ['jasmine_node','watch']);
  grunt.registerTask('default', ['karma:unit', 'replace','uglify']);
};
