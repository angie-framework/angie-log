// System Modules
import fs from                  'fs';
import chalk from               'chalk';

// Test Modules
import {expect, assert} from    'chai';
import simple, {mock} from      'simple-mock';

// Angie Log Modules
import {default as Log} from    '../../../src/services/$LogProvider';

const p = process,
      bold = chalk.bold;

describe('$LogProvider', function() {
    const noop = () => undefined;

    describe('constructor', function() {
        let observeMock;

        beforeEach(function() {
            observeMock = mock(Object, 'observe', noop);
        });
        afterEach(() => simple.restore());
        it('test contructor object arguments', function() {
            let logger = new Log({
                outfile: 'test',
                name: 'test',
                timestamp: false,
                level: 'info',
                silent: true,
                messages: [ 'test' ]
            });
            expect(Object.observe.calls[0].args[0]).to.deep.eq([ 'test' ]);
            expect(Object.observe.calls[0].args[1]).to.be.a.function;
            expect(Object.observe.calls[0].args[2]).to.deep.eq([ 'add' ]);
            expect(logger.$$outfile).to.eq('test');
            expect(logger.$$name).to.eq('test');
            expect(logger.$$timestamp).to.be.false;
            expect(logger.$$level).to.deep.eq(new Set('INFO'));
            expect(logger.$$silent).to.be.true;
            expect(logger.$$messages).to.deep.eq([ 'test' ]);

            expect(logger.$$initialLevel).to.deep.eq([ 'INFO' ]);
        });
        it('test constructor object arguments alt names', function() {
            let logger = new Log({
                file: 'test',
                logLevel: 'info'
            });
            expect(Object.observe.calls[0].args[0]).to.deep.eq([]);
            expect(Object.observe.calls[0].args[1]).to.be.a.function;
            expect(Object.observe.calls[0].args[2]).to.deep.eq([ 'add' ]);
            expect(logger.$$outfile).to.eq('test');
            expect(logger.$$level).to.deep.eq(new Set('INFO'));

            expect(logger.$$initialLevel).to.deep.eq([ 'INFO' ]);

            logger = new Log({
                file: 'test',
                levels: [ 'info', 'debug' ]
            });

            assert(logger.$$level.has('INFO'));
            assert(logger.$$level.has('DEBUG'));

            expect(logger.$$initialLevel).to.deep.eq([ 'INFO', 'DEBUG' ]);

            logger = new Log({
                file: 'test',
                logLevels: [ 'info', 'debug' ]
            });

            assert(logger.$$level.has('INFO'));
            assert(logger.$$level.has('DEBUG'));
        });
        it('test constructor arguments', function() {
            let logger = new Log('test', 'test', false, 'info', true, [ 'test' ]);
            expect(Object.observe.calls[0].args[0]).to.deep.eq([ 'test' ]);
            expect(Object.observe.calls[0].args[1]).to.be.a.function;
            expect(Object.observe.calls[0].args[2]).to.deep.eq([ 'add' ]);
            expect(logger.$$outfile).to.eq('test');
            expect(logger.$$name).to.eq('test');
            expect(logger.$$timestamp).to.be.false;
            expect(logger.$$level).to.deep.eq(new Set('INFO'));
            expect(logger.$$silent).to.be.true;
            expect(logger.$$messages).to.deep.eq([ 'test' ]);

            expect(logger.$$initialLevel).to.deep.eq([ 'INFO' ]);
        });
        it('test defaults', function() {
            let logger = new Log();
            expect(Object.observe.calls[0].args[0]).to.deep.eq([]);
            expect(Object.observe.calls[0].args[1]).to.be.a.function;
            expect(Object.observe.calls[0].args[2]).to.deep.eq([ 'add' ]);
            expect(logger.$$outfile).to.eq(`${p.cwd()}/angie.log`);
            expect(logger.$$name).to.be.null;
            expect(logger.$$timestamp).to.be.true;
            expect(logger.$$level).to.deep.eq(new Set('DEBUG'));
            expect(logger.$$silent).to.be.false;
            expect(logger.$$messages).to.deep.eq([]);

            expect(logger.$$initialLevel).to.deep.eq([ 'DEBUG' ]);

            logger = new Log({});
            expect(Object.observe.calls[0].args[0]).to.deep.eq([]);
            expect(Object.observe.calls[0].args[1]).to.be.a.function;
            expect(Object.observe.calls[0].args[2]).to.deep.eq([ 'add' ]);
            expect(logger.$$outfile).to.eq(`${p.cwd()}/angie.log`);
            expect(logger.$$timestamp).to.be.true;
            expect(logger.$$level).to.deep.eq(new Set('DEBUG'));
            expect(logger.$$silent).to.be.false;
            expect(logger.$$messages).to.deep.eq([]);

            expect(logger.$$initialLevel).to.deep.eq([ 'DEBUG' ]);
        });
        describe('test invalid log levels', function() {
            it('test one', function() {
                expect(
                    new Log({ level: 'test' }).$$level
                ).to.deep.eq(new Set('DEBUG'));
            });
            it('test many', function() {
                expect(
                    new Log({ levels: [ 'test', 'nottest' ] }).$$level
                ).to.deep.eq(new Set('DEBUG'));
            });
        });
        describe('Observer calls', function() {
            let logger;

            beforeEach(function() {
                simple.restore();
                mock(Object, 'observe', function(_, fn) {
                    fn();
                });
                mock(Date.prototype, 'toString', () => 'test');
                mock(fs, 'appendFile', noop);
            });
            it('test Observer called with message', function() {
                logger = new Log({
                    messages: [ 'test' ]
                });
                expect(fs.appendFile.calls[0].args).to.deep.eq(
                    [ `${p.cwd()}/angie.log`, 'test\n' ]
                );
                expect(logger.$$messages.length).to.eq(0);
            });
            it('test Observer called with message \\r\\n', function() {
                logger = new Log({
                    messages: [ 'test\r' ]
                });
                expect(fs.appendFile.calls[0].args).to.deep.eq(
                    [ `${p.cwd()}/angie.log`, 'test\r' ]
                );
                expect(logger.$$messages.length).to.eq(0);
            });
        });
    });
    describe('instance log methods', function() {
        let logger;

        beforeEach(function() {
            logger = new Log();
            mock(logger, '$$filter', noop);
        });
        it('error', function() {
            logger.error('test', 'test');
            expect(
                logger.$$filter.calls[0].args
            ).to.deep.eq([ 'error', 'test', 'test' ]);
        });
        it('warn', function() {
            logger.warn('test', 'test');
            expect(
                logger.$$filter.calls[0].args
            ).to.deep.eq([ 'warn', 'test', 'test' ]);
        });
        it('debug', function() {
            logger.debug('test', 'test');
            expect(
                logger.$$filter.calls[0].args
            ).to.deep.eq([ 'debug', 'test', 'test' ]);
        });
        it('info', function() {
            logger.info('test', 'test');
            expect(
                logger.$$filter.calls[0].args
            ).to.deep.eq([ 'info', 'test', 'test' ]);
        });
    });
    describe('$setOutfile', function() {
        let logger;

        beforeEach(function() {
            logger = new Log();
        });
        it('test called without an argument', function() {
            logger.$$outfile = '';
            expect(logger.$setOutfile()).to.be.an.object;
            expect(logger.$$outfile).to.eq(`${p.cwd()}/angie.log`);
        });
        it('test called with an argument', function() {
            logger.$$outfile = '';
            expect(logger.$setOutfile('test')).to.be.an.object;
            expect(logger.$$outfile).to.eq('test');
        });
    });
    describe('$setName', function() {
        let logger;

        beforeEach(function() {
            logger = new Log();
        });
        it('test called without an argument', function() {
            expect(logger.$setName()).to.be.an.object;
            expect(logger.$$name).to.be.null;
        });
        it('test called with an argument', function() {
            expect(logger.$setName('test')).to.be.an.object;
            expect(logger.$$name).to.eq('test');
        });
    });
    describe('$setTimestamp', function() {
        let logger;

        beforeEach(function() {
            logger = new Log();
        });
        it('test called without an argument', function() {
            logger.$$timestamp = '';
            expect(logger.$setTimestamp()).to.be.an.object;
            expect(logger.$$timestamp).to.be.true;
        });
        it('test called with an argument', function() {
            logger.$$timestamp = '';
            expect(logger.$setTimestamp(false)).to.be.an.object;
            expect(logger.$$timestamp).to.be.false;
        });
    });
    describe('$setLevel', function() {
        let logger;

        beforeEach(function() {
            logger = new Log();
        });
        it('test called without an argument', function() {
            logger.$$level = '';
            expect(logger.$setLevel()).to.be.an.object;
            expect(logger.$$level).to.deep.eq(new Set('DEBUG'));
        });
        it('test called with a bad argument', function() {
            logger.$$level = '';
            expect(logger.$setLevel('test')).to.be.an.object;
            expect(logger.$$level).to.deep.eq(new Set('DEBUG'));
        });
        it('test called with a good argument', function() {
            logger.$$level = '';
            expect(logger.$setLevel('info')).to.be.an.object;
            expect(logger.$$level).to.deep.eq(new Set('INFO'));
        });
    });
    describe('$setLevels', function() {
        let logger;

        beforeEach(function() {
            logger = new Log();
        });
        it('test called without an argument', function() {
            logger.$$level = '';
            expect(logger.$setLevels()).to.be.an.object;
            expect(logger.$$level).to.eq('');
        });
        it('test called with a bad argument', function() {
            logger.$$level = '';

            expect(logger.$setLevels('debug')).to.be.an.object;
            expect(logger.$$level).to.eq('');

            expect(logger.$setLevels([])).to.be.an.object;
            expect(logger.$$level).to.eq('');
        });
        it('test called with a good argument', function() {
            logger.$$level = '';
            expect(logger.$setLevels([ 'info', 'debug' ])).to.be.an.object;
            expect(logger.$$level).to.deep.eq(new Set('INFO', 'DEBUG'));
        });
    });
    describe('$setSilent', function() {
        let logger;

        beforeEach(function() {
            logger = new Log();
        });
        it('test called without an argument', function() {
            logger.$$silent = '';
            expect(logger.$setSilent()).to.be.an.object;
            expect(logger.$$silent).to.be.false;
        });
        it('test called with an argument', function() {
            logger.$$silent = '';
            expect(logger.$setSilent(true)).to.be.an.object;
            expect(logger.$$silent).to.be.true;
        });
    });
    describe('$$filter', function() {
        let logger;

        beforeEach(function() {
            logger = new Log();
            mock(logger, '$logger', noop);
        });
        it('test logger called with invalid level', function() {
            expect(logger.$$filter('test')).to.be.an.object;
            expect(logger.$$logger).to.not.have.been.called;
        });
        describe('test logger called with valid level', function() {
            it('test default levels', function() {
                expect(logger.$$filter('debug', 'test')).to.be.an.object;
                expect(logger.$$logger).to.not.have.been.called;
            });
            it('test custom levels', function() {
                logger.$$level = new Set('INFO', 'DEBUG');
                expect(logger.$$filter('debug', 'test')).to.be.an.object;
                expect(logger.$$logger).to.not.have.been.called;
            });
        });
    });
    describe('$$logger', function() {
        let logger;

        beforeEach(function() {
            mock(Object, 'observe', noop);
            mock(Date.prototype, 'toString', () => 'test');
            logger = new Log('angie.log', 'test');
            mock(Log, 'debug', noop);
        });
        afterEach(() => simple.restore());
        describe('test no specified log level', function() {
            beforeEach(function() {
                mock(Log, 'warn', noop);
            });
            it('test without name', function() {
                logger.$$name = null;
                expect(logger.$$logger('test')).to.be.an.object;
                expect(Log.warn.calls[0].args[0]).to.eq(
                    '$$logger called explicitly without a valid log level'
                );
            });
            it('test with name', function() {
                expect(logger.$$logger('test')).to.be.an.object;
                expect(Log.warn.calls[0].args[0]).to.eq(
                    `[${chalk.cyan('test')}] $$logger called explicitly ` +
                    'without a valid log level'
                );
            });
        });
        it('test with timestamp', function() {
            expect(logger.$$logger('debug', 'test')).to.be.an.object;
            expect(logger.$$messages.length).to.eq(1);
            expect(logger.$$messages[0]).to.eq(
                '[test] [DEBUG] [test] : test \r'
            );
            expect(Log.debug.calls[0].args[0]).to.deep.eq([ 'test' ]);
        });
        it('test without timestamp', function() {
            logger.$setTimestamp(false);
            expect(logger.$$logger('debug', 'test')).to.be.an.object;
            expect(logger.$$messages.length).to.eq(1);
            expect(logger.$$messages[0]).to.eq(
                '[DEBUG] [test] : test \r'
            );
            expect(Log.debug.calls[0].args[0]).to.deep.eq([ 'test' ]);
        });
        it('test silent', function() {
            logger.$setSilent(true);
            expect(logger.$$logger('debug', 'test')).to.be.an.object;
            expect(logger.$$messages.length).to.eq(1);
            expect(logger.$$messages[0]).to.eq(
                '[test] [DEBUG] [test] : test \r'
            );
            expect(Log.debug).to.not.have.been.called;
        });
    });
    describe('$$resetLevels', function() {
        let logger;

        beforeEach(function() {
            logger = new Log();
            logger.$$initialLevel = 'test';
            mock(logger, '$setLevels', noop);
        });
        it('test reset', function() {
            logger.$$resetLevels();
            expect(logger.$setLevels.calls[0].args[0]).to.eq('test');
        });
    });
    describe('log methods', function() {
        beforeEach(function() {
            mock(Date.prototype, 'toString', () => 'test');
            mock(console, 'log', noop);
            mock(console, 'warn', noop);
            mock(console, 'error', noop);
        });
        afterEach(() => simple.restore());
        it('info', function() {
            Log.info('test\n', 'test\n');
            expect(console.log.calls[0].args[0]).to.eq(
                bold.apply(null, [
                    chalk.green('[test] [INFO] :'),
                    'test ',
                    'test ',
                    '\r'
                ])
            );
        });
        it('debug', function() {
            Log.debug('test\n', 'test\n');
            expect(console.log.calls[0].args[0]).to.eq(
                bold.apply(null, [
                    '[test] [DEBUG] :',
                    'test ',
                    'test ',
                    '\r'
                ])
            );
        });
        it('warn', function() {
            Log.warn('test\n', 'test\n');
            expect(console.warn.calls[0].args[0]).to.eq(
                bold.apply(null, [
                    chalk.yellow('[test] [WARN] :'),
                    'test ',
                    'test ',
                    '\r'
                ])
            );
        });
        it('error', function() {
            Log.error('test\n', 'test\n');
            expect(console.error.calls[0].args[0]).to.eq(
                bold.apply(null, [
                    chalk.red('[test] [ERROR] :'),
                    'test ',
                    'test ',
                    '\r'
                ])
            );
        });
        it('error with stack', function() {
            Log.error({ stack: 'stack' }, 'test\n');
            expect(console.error.calls[0].args[0]).to.eq(
                bold.apply(null, [
                    chalk.red('[test] [ERROR] :'),
                    'stack',
                    'test ',
                    '\r'
                ])
            );
        });
    });
});