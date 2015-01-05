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
          'build/sooper.js': {
            input: 'src/sooper.js',
            prepend: "sooper = function() {",
            append: "}();"
          }
        }
      }
    },

    replace: {
      debug: {
        src: ['build/sooper.js'],
        dest: 'build/sooper.js',
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
      build: {
        files: {
          'build/sooper.js': ['build/sooper.js']
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

  grunt.registerTask('replaceSingleUseFunctions', function() {
    var content = grunt.file.read('build/sooper.js'),
        replacements = {},
        replaceTargetRegex = /\/\/<replaceTarget>\s*(\w+)\([\s\S]+?\/\/<\/replaceTarget>/gi,
        match;
    while(match=replaceTargetRegex.exec(content))
      replacements[match[1]] = match[0]

    for (var replacement in replacements) {
      var regex = new RegExp("//<replaceSource>\\s*function\\s*"+replacement+"[^{]+(\\{[\\s\\S]+?\\})\\s*\/\/<\/replaceSource>","gi");
      var match = regex.exec(content);
      if (match) {
        content = content.replace(match[0],"");
        content = content.replace(replacements[replacement], match[1]);
      }
    }
    grunt.file.write('build/sooper.js',content);
  });

  grunt.registerTask('test', ['jasmine_node','watch']);
  grunt.registerTask('build', ['jasmine_node','file_append','replace','replaceSingleUseFunctions','uglify','jasmine'])
  grunt.registerTask('default', ['build']);
};
