module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/gameLogic.js', 'src/game.js'],
        dest: 'dist/everything.js',
      },
    },
    uglify: {
      options: {
        sourceMap: true,
      },
      my_target: {
        files: {
          'dist/everything.min.js': ['dist/everything.js']
        }
      }
    },
    processhtml: {
      dist: {
        files: {
          'game.min.html': ['game.html']
        }
      }
    },
    manifest: {
      generate: {
        options: {
          basePath: '.',
          cache: [
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.min.js',
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-touch.min.js',
            'http://yoav-zibin.github.io/emulator/dist/turnBasedServices.3.min.js',
            'http://yoav-zibin.github.io/emulator/main.css',
            'dist/everything.min.js',
            'game.css',
          ],
          network: [
            'languages/en.js',
            'dist/everything.min.js.map',
            'dist/everything.js'
          ],
          timestamp: true
        },
        dest: 'game.appcache',
        src: []
      }
    },
  });

  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', [
      'concat', 'uglify',
      'processhtml', 'manifest']);

};
