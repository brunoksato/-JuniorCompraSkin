'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var awspublish = require('gulp-awspublish');
var nconf = require('nconf');

gulp.task('publish', function () {

  nconf.argv()
   .env()
   .file({ file: './aws.json' });

  var awsProperties = {
    "params": {
      "Bucket": nconf.get('AWS_BUCKET')
    },
    'accessKeyId'    : nconf.get('AWS_KEY'),
    'secretAccessKey' : nconf.get('AWS_SECRET'),
    'region' : nconf.get('AWS_REGION'),
    'distributionId' : nconf.get('AWS_DISTRIBUTION')
  };

  var publisher = awspublish.create(awsProperties);
  var headers = {'Cache-Control': 'max-age=315360000, no-transform, public'};

  return gulp.src(['./css', './js', 'index.html'])
      .pipe(awspublish.gzip())
      .pipe(publisher.publish(headers))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter())
});
