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
      all: ['spec/'],
      options: {
        useHelpers: true
      }
    },

    jasmine: {
      test: {
        src: 'build/**/*.js',
        options: {
          specs: 'spec/*spec.js',
          helpers: 'spec/*helpers.js'
        }
      }
    },

    file_append: {
      module: {
        files: {
          'build/soop.js': {
            input: 'src/soop.js',
            prepend: "soop = function() {",
            append: "}();"
          }
        }
      }
    },

    replace: {
      debug: {
        src: ['build/soop.js'],
        dest: 'build/soop.js',
        replacements: [{
          from: /\/\/<debug>[\s\S]*?\/\/<\/debug>/gi,
          to: ''
        }, {
          from: /module\.exports\s*=/,
          to: 'return'
        }, {
          from: /global/gi,
          to: 'window'
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
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-file-append');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', ['jasmine_node','watch']);
  grunt.registerTask('build', ['jasmine_node','file_append','replace','uglify','jasmine'])
  grunt.registerTask('default', ['build']);
};
