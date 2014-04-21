/*
 * grunt-upload2upyun
 * http://www.bootcss.com
 *
 * Copyright (c) 2014 'wangsai'
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    upload2upyun: {
      options: {
        bucketname: 'image-ghostchina-com',
        username: 'uploader',
        password: 'noriko1124',
      },
      custom_options: {
        files: [
          {
            expand: true,
            cwd: './',
            src:['**/*', '!node_modules/**/*', '!lib/**/*'],
            dest:'/tmp/custom_options'
          }
        ]
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'upload2upyun']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
