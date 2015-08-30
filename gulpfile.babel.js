// System Modules
import fs from                  'fs';
import gulp from                'gulp';
import {argv} from              'yargs';
import eslint from              'gulp-eslint';
import jscs from                'gulp-jscs';
import istanbul from            'gulp-istanbul';
import {Instrumenter} from      'isparta';
import mocha from               'gulp-mocha';
import cobertura from           'istanbul-cobertura-badger';
import babel from               'gulp-babel';
import esdoc from               'gulp-esdoc';
import {bold, red} from         'chalk';

const bread = (str) => bold(red(str));

const SRC_DIR = 'src',
    SRC = `${SRC}/**/*.js`,
    TRANSPILED_SRC = 'dist',
    TEST_SRC = 'test/src/**/*.spec.js',
    DOC_SRC = 'doc',
    COVERAGE_SRC = 'coverage';

gulp.task('eslint', function () {
    gulp.src([ SRC, TEST_SRC ]).pipe(
        eslint()
    ).pipe(
        eslint.format()
    ).pipe(
        eslint.failOnError()
    );
});
gulp.task('jscs', [ 'eslint' ], function () {
    return gulp.src([ SRC, TEST_SRC ])
        .pipe(jscs({
            fix: true,
            configPath: '.jscsrc',
            esnext: true
        }));
});
gulp.task('mocha', function(cb) {
    let proc;

    new Promise(function(resolve) {
        proc = gulp.src(SRC).pipe(
            istanbul({
                instrumenter: Instrumenter,
                includeUntested: false
            })
        ).pipe(
            istanbul.hookRequire()
        ).on('finish', function() {
            gulp.src(
                [ 'test/src/testUtil.spec.js', 'test/**/!(*testUtil).spec.js' ],
                { read: false }
            ).pipe(mocha({
                reporter: 'spec'
            }).on('error', function(e) {
                throw new Error(e);
            }).on('end', function() {
                resolve();
            }));
        });
    }).then(function() {
        return proc.pipe(

            // TODO fail if under accepted limit
            istanbul.writeReports({
                reporters: [ 'text', 'text-summary', 'cobertura', 'clover' ]
            })
        );
    }).then(function() {
        return cobertura('coverage/cobertura-coverage.xml', 'svg', cb);
    });
});
gulp.task('babel', function() {
    return gulp.src('src/**').pipe(babel({
        comments: false
    })).pipe(gulp.dest('dist'));
});
gulp.task('esdoc', function() {
    return gulp.src(SRC_DIR).pipe(esdoc({ destination: DOC_SRC }));
});
gulp.task('bump', function() {
    const version = argv.version,
        bump = (f) => fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(
            /[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}/,
            version
        ));
    if (version) {

        // Verify that the version is in the CHANGELOG
        if (fs.readFileSync('CHANGELOG.md', 'utf8').indexOf(version) === -1) {
            throw new Error(bread('Version has no entry in CHANGELOG.md'));
        }

        bump('bin/angie-log');
        bump('bin/angie-log-dist');
        bump('package.json');
    } else {
        throw new Error(bold(red('No version specified!!')));
    }
});
gulp.task('watch', [ 'jscs', 'mocha' ], function() {
    gulp.watch([ SRC, TEST_SRC ], [ 'mocha' ]);
});
gulp.task('test', [ 'jscs', 'mocha' ]);
gulp.task('default', [ 'jscs', 'mocha', 'babel', 'esdoc' ]);