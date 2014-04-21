/*
 * Support upload to UPYun.
 * Copyright (c) 2014 WangSai
 * Licensed under the MIT license.
 *
 * grunt-contrib-copy
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 Chris Talkington, contributors
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt-contrib-copy/blob/master/LICENSE-MIT
 */

module.exports = function(grunt) {
  'use strict';

  var path = require('path');
  var fs = require('fs');
  var chalk = require('chalk');
  var when = require('when');
  var inspect = require('eyes').inspector({ stream: null });
  var nodefn  = require('when/node/function');

  var UPYun = require('../lib/upyun').UPYun;

  grunt.registerMultiTask('upload2upyun', 'Copy files to UPYun.', function() {
    var kindOf = grunt.util.kindOf;

    var options = this.options({
      bucketname: '', //空间名称
      username: '', //操作员名称
      password: '' //密码
    });

    //Async operation
    var done = this.async();

    //Init UPYUN api
    var upyun = new UPYun(options.bucketname, options.username, options.password);

    var dest;
    var isExpandedPair;
    var uploads = [];

    this.files.forEach(function(filePair) {
      isExpandedPair = filePair.orig.expand || false;

      filePair.src.forEach(function(src) {
        

        if (detectDestType(filePair.dest) === 'directory') {
          dest = (isExpandedPair) ? filePair.dest : unixifyPath(path.join(filePair.dest, src));
        } else {
          dest = filePair.dest;
        }

        if (grunt.file.isFile(src)) {
          var upload = when.defer();
        // Folders as part of a filepath will be created by upyun; empty folders have no meaning.
        //   grunt.verbose.writeln('Creating ' + chalk.cyan(dest));
        //   grunt.file.mkdir(dest);
        //   tally.dirs++;
        // } else {
          // Upload the destination file to UPYUN.
          nodefn.call(upyun.writeFile, dest, src, true).then(function(){
            // Print a success message.
            grunt.verbose.writeln('Uploading ' + chalk.cyan(src) + ' -> ' + chalk.cyan(dest));
            upload.resolve(src);
          }).otherwise(function(err){
            upload.reject(err);
          });

          uploads.push(upload.promise);

        }
      });
    });


    when.all(uploads).then(function(files){
      grunt.log.write('Uploaded ' + chalk.cyan(files.length) + (files.length === 1 ? ' file' : ' files'));
      done();
    }).otherwise(function(err){
      done(new Error(inspect(err)));
    });

  });

  var detectDestType = function(dest) {
    if (grunt.util._.endsWith(dest, '/')) {
      return 'directory';
    } else {
      return 'file';
    }
  };

  var unixifyPath = function(filepath) {
    if (process.platform === 'win32') {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  };
};