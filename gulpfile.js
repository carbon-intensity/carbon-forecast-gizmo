'use strict';

require('dotenv').config();
let moment = require('moment');

const gulp  = require('gulp');
const debug = require('gulp-debug');

const awspublish = require('gulp-awspublish');
const babel      = require('gulp-babel');
const htmlmin    = require('gulp-htmlmin');
const jshint     = require('gulp-jshint');
const pug        = require('gulp-pug');
const rename     = require('gulp-rename');
const rev        = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const sourcemaps = require('gulp-sourcemaps');
const uglify     = require('gulp-uglify');


// Config
// -----------------------------------------------------------------------------
const buildFolder = './build/';
const gizmoVersion = '1.0.13--beta'; // for versioning in Cloudfront and Google Analytics


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
                version: gizmoVersion,
                timestamp : moment().format(`[Version] [${gizmoVersion}], [built at:] h:mm:ssa [on the] Do MMMM YYYY.`)
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
        .pipe(gulp.dest( buildFolder ));
});

gulp.task('compile:javascript', () => {
    return gulp.src(['_javascript/carbon-intensity-widget.js'])
        .pipe( jshint({
            esversion: 6
        }) )
        .pipe( jshint.reporter('jshint-stylish', { beep: true }) )
        .pipe( sourcemaps.init())
        .pipe( babel({
            presets: ['env']
        }) )
        // .pipe( uglify() )
        .pipe( sourcemaps.write('./') )
        // .pipe( rename( (path) => {
        //     path.basename += ".min";
        // }) )
        .pipe( gulp.dest(buildFolder + 'javascript') )
        .pipe( rev() )
        .pipe( gulp.dest(buildFolder + 'javascript') )
        .pipe( rev.manifest() )
        .pipe( gulp.dest('./') );
});

gulp.task('test', () => {
    gulp.src( buildFolder + '**/*.html')
        .pipe(debug())
})

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

    gulp.src( buildFolder + '**/*.js')
        .pipe(rename(function (path) {
            path.dirname = gizmoVersion + '/' + path.dirname;
        }))
        // `publisher` will add Content-Length, Content-Type and headers specified
        // above. If not specified it will set x-amz-acl to public-read by
        // default
        .pipe(publisher.publish({'Cache-Control': 'max-age=315360000, no-transform, public'}))

        // Create a cache file to speed up consecutive uploads.
        .pipe(publisher.cache())

        // Print upload updates to console.
        .pipe(awspublish.reporter());

    gulp.src( buildFolder + '**/*.*')
        .pipe(rename(function (path) {
            path.dirname = gizmoVersion + '/' + path.dirname;
        }))
        // `publisher` will add Content-Length, Content-Type and headers specified
        // above. If not specified it will set x-amz-acl to public-read by
        // default
        .pipe(publisher.publish({'Cache-Control': 'max-age=600, no-transform, public'}))

        // Create a cache file to speed up consecutive uploads.
        .pipe(publisher.cache())

        // Print upload updates to console.
        .pipe(awspublish.reporter());
});