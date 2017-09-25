'use strict';

require('dotenv').config()

const gulp = require('gulp');

const awspublish = require('gulp-awspublish');
const babel      = require('gulp-babel');
const htmlmin    = require('gulp-htmlmin');
const pug        = require('gulp-pug');
const rename     = require('gulp-rename');
const rev        = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const uglify     = require('gulp-uglifyjs');


// Config
// -----------------------------------------------------------------------------
const buildFolder = './build/';
const gizmoVersion = '1.0.12--beta'; // for versioning in Cloudfront and Google Analytics


// Watch JavaScript and pug template files, then build the pages on changes
// -----------------------------------------------------------------------------
// TODO: Add Browsersync
gulp.task('default',  () => {
    gulp.watch(['_javascript/*.js', '_views/*.pug'], ['build:pages'], (event) => {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});


gulp.task('build:pages', ['compile:javascript'], () => {
    let manifest = gulp.src("./rev-manifest.json");

    return gulp.src('_views/*.pug')
        .pipe(pug({
            pretty : true,
            verbose: true,
            data: {
                rollbarAccessToken: process.env.ROLLBAR_ACCESS_TOKEN,
                version: gizmoVersion
            }
        }))
        .pipe(revReplace({
            replaceInExtensions : ['.pug', '.html'],
            manifest: manifest
        }))
        .pipe(htmlmin({
            collapseWhitespace : true,
            minifyCSS : true,
            minifyJS : true
        }))
        .pipe(gulp.dest( buildFolder + ''));
});

gulp.task('compile:javascript', () => {
    gulp.src('_javascript/carbon-intensity-widget.js')
        .pipe(rename( (path) => {
            path.basename += ".min";
        }))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest( buildFolder + 'javascript'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./'));
});

gulp.task('publish', ['build:pages'], () => {

    // Create a new `publisher` using S3 options.
    // -------------------------------------------------------------------------
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
    // See .env-exmaple for required parameters; change to your own and save as .env.
    let publisher = awspublish.create({
            region: process.env.AWS_S3_REGION,
            params: {
                Bucket: process.env.AWS_S3_BUCKET
            },
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET
        },
        {
            cacheFileName: './.aws-publish-cache'
        });

    // Define any custom headers
    // -------------------------------------------------------------------------
    let headers = {
        'Cache-Control': 'max-age=315360000, no-transform, public'
    };

    return gulp.src( buildFolder + '**')
        .pipe(rename(function (path) {
            path.dirname = gizmoVersion + '/' + path.dirname;
        }))
        // `publisher` will add Content-Length, Content-Type and headers specified
        // above. If not specified it will set x-amz-acl to public-read by
        // default
        .pipe(publisher.publish(headers))

        // Create a cache file to speed up consecutive uploads.
        .pipe(publisher.cache())

        // Print upload updates to console.
        .pipe(awspublish.reporter());
});