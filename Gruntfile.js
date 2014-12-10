module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    karma: {
      options: {
        configFile: 'tests/karma.conf.js'
      },
      unit: {
        singleRun: true
      },
      dev: {
        singleRun: false
      }
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

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', ['karma:dev']);
  grunt.registerTask('default', ['karma:unit', 'replace','uglify']);
};
