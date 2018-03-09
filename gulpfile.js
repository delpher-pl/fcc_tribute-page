const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

// Optymalizacja Plików Graficznych
// https://www.youtube.com/watch?v=9CfGpGnf2fo
// const imagemin = require('gulp-imagemin');
// const changed = require('gulp-changed');

// Optymalizacja i Minifikacja Plików HTML
// https://www.youtube.com/watch?v=d0MdJrYa6Zk
// 
// <!-- build:css -->
// link tags
// <!-- endbuild -->
// 
// <!-- build:js -->
// script tags
// <!-- endbuild -->

const htmlReplace = require('gulp-html-replace');
const htmlmin = require('gulp-htmlmin');

const del = require('del');
const sequence = require('run-sequence');

const path = {
    dist: 'dist/',
    src: 'src/',
    nodemodules: 'node_modules/',
    
    htmlin: 'src/*.html',
    htmlout: 'dist/',

    cssin: 'src/css/**/*.css',
    cssdev: 'src/css/',
    cssout: 'dist/css/',
    cssoutname: 'style.css',

    scssin: 'src/scss/**/*.scss',
    scssout: 'src/css/',

    jsin: 'src/js/**/*.js',
    jsdev: 'src/js/',
    jsout: 'dist/js/',
    jsoutname: 'main.js',

    imgin: 'src/img/**/*.{jpg,jpeg,png,gif,svg}',
    imgout: 'dist/img/'
};

const libs = {
    sass: [
    ],
    js: [
    ],
    watch: []
};



// Compile SASS
gulp.task('sass', function(){
    return gulp.src([...libs.sass,path.scssin])
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: [
                'last 3 versions',
                'Firefox > 30',
                'Chrome > 30',
                'Opera > 30'
            ]
        }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(path.scssout))
        .pipe(browserSync.stream());
});


// Min CSS
gulp.task('min', function(){
    return gulp.src(path.cssin)
        // .pipe(concat('style.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.cssout+'min/'));
});


// Move JS files to SRC
gulp.task('jsImport', function(){
    gulp.src([...libs.js])
        .pipe(gulp.dest(path.jsdev));
        // .pipe(browserSync.stream());
        
});


//
gulp.task('js', function(){
    return gulp.src(path.jsin)
        // .pipe(concat('main.js'))
        .pipe(babel({presets: ['es2015']})
            .on('error', function(e){console.log(e);}))
        .pipe(uglify()
            .on('error', function(e){console.log(e);}))
        .pipe(gulp.dest(path.jsout));
        
});




// Watch SASS & Serve
gulp.task('serve', ['sass'], function(){
    browserSync.init({
        server: "./src",
        open: false
    });
    // gulp.watch([src/**/*.scss'], ['sass']);
    gulp.watch(path.htmlin).on('change', browserSync.reload);
});

// Watch SASS & Serve
gulp.task('watch', function(){
    gulp.watch(['src/**/*.scss'], ['sass']);
});

// Move FA Fonts folder to src
gulp.task('fonts', function(){
    return gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest("src/fonts"));
});

//
gulp.task('css', function(){
    return gulp.src('node_modules/normalize.css/*.css')
        .pipe(gulp.dest(path.cssdev));
});

gulp.task('html', function(){
    return gulp.src(path.htmlin)
        .pipe(htmlReplace({
            'css': 'css/style.css',
            'js': 'js/main.js'
        }))
        .pipe(htmlMin({
            sortAttributes: true,
            sortClassName: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(path.dist));
});

gulp.task('clean', function(){
    return del(['dist']);
});

gulp.task('build', function(){
    sequence('clean', ['jsImport', 'js', 'fa', 'css','min']);
});

gulp.task('default', ['jsImport', 'serve', 'watch', 'fa', 'css','min']);