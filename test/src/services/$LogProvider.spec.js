// System Modules
import fs from                  'fs';
import chalk from               'chalk';

// Test Modules
import {expect} from            'chai';
import simple, {mock} from      'simple-mock';

// Angie Log Modules
import {default as Log} from    '../../../src/services/$LogProvider';

const p = process,
      bold = chalk.bold;

describe('$LogProvider', function() {
    const noop = () => undefined;

    describe('constructor', function() {
        beforeEach(function() {
            mock(Object, 'observe', noop);
        });
        afterEach(() => simple.restore());
        it('test contructor object arguments', function() {
            let log = new Log({
                outfile: 'test',
                timestamp: false,
                level: 'info',
                silent: true
            });
            expect(Object.observe.calls[0].args[0]).to.deep.eq([]);
            expect(Object.observe.calls[0].args[1]).to.be.a.function;
            expect(Object.observe.calls[0].args[2]).to.deep.eq([ 'add' ]);
            expect(log.outfile).to.eq('test');
            expect(log.timestamp).to.be.false;
            expect(log.level).to.eq('INFO');
            expect(log.silent).to.be.true;
        });
        it('test constructor object arguments alt names', function() {
            let log = new Log({
                file: 'test',
                timestamp: false,
                logLevel: 'info',
                silent: true
            });
            expect(Object.observe.calls[0].args[0]).to.deep.eq([]);
            expect(Object.observe.calls[0].args[1]).to.be.a.function;
            expect(Object.observe.calls[0].args[2]).to.deep.eq([ 'add' ]);
            expect(log.outfile).to.eq('test');
            expect(log.timestamp).to.be.false;
            expect(log.level).to.eq('INFO');
            expect(log.silent).to.be.true;
        });
        it('test constructor arguments', function() {
            let log = new Log('test', false, 'info', true);
            expect(Object.observe.calls[0].args[0]).to.deep.eq([]);
            expect(Object.observe.calls[0].args[1]).to.be.a.function;
            expect(Object.observe.calls[0].args[2]).to.deep.eq([ 'add' ]);
            expect(log.outfile).to.eq('test');
            expect(log.timestamp).to.be.false;
            expect(log.level).to.eq('INFO');
            expect(log.silent).to.be.true;
        });
        it('test defaults', function() {
            let log = new Log();
            expect(Object.observe.calls[0].args[0]).to.deep.eq([]);
            expect(Object.observe.calls[0].args[1]).to.be.a.function;
            expect(Object.observe.calls[0].args[2]).to.deep.eq([ 'add' ]);
            expect(log.outfile).to.eq(`${p.cwd()}/angie.log`);
            expect(log.timestamp).to.be.true;
            expect(log.level).to.eq('DEBUG');
            expect(log.silent).to.be.false;

            log = new Log({});
            expect(Object.observe.calls[0].args[0]).to.deep.eq([]);
            expect(Object.observe.calls[0].args[1]).to.be.a.function;
            expect(Object.observe.calls[0].args[2]).to.deep.eq([ 'add' ]);
            expect(log.outfile).to.eq(`${p.cwd()}/angie.log`);
            expect(log.timestamp).to.be.true;
            expect(log.level).to.eq('DEBUG');
            expect(log.silent).to.be.false;
        });
        it('test invalid log level', function() {
            expect(new Log({ level: 'test' }).level).to.eq('DEBUG');
        });
        describe('Observer calls', function() {
            let log;

            beforeEach(function() {
                simple.restore();
                log = new Log({});
                mock(Date.prototype, 'toString', () => 'test');
                mock(Log, 'debug', noop);
                mock(Log, 'error', noop);
                mock(fs, 'appendFile', noop);
            });
            it('test Observer called with message', function(cb) {
                log.logger('test');
                setTimeout(function() {
                    expect(fs.appendFile.calls[0].args).to.deep.eq(
                        [ `${p.cwd()}/angie.log`, '[test] DEBUG : test\n' ]
                    );
                    cb();
                }, 1000);
            });
            it('test Observer called with message \\r\\n', function(cb) {
                log.logger('test\r');
                setTimeout(function() {
                    expect(fs.appendFile.calls[0].args).to.deep.eq(
                        [ `${p.cwd()}/angie.log`, '[test] DEBUG : test\r' ]
                    );
                    cb();
                }, 100);
            });
        });
    });
    describe('logger', function() {
        let log;

        beforeEach(function() {
            mock(Object, 'observe', noop);
            mock(Date.prototype, 'toString', () => 'test');
            log = new Log();
            mock(Log, 'debug', noop);
        });
        afterEach(() => simple.restore());
        it('test with timestamp', function() {
            expect(log.logger('test')).to.be.an.object;
            expect(Log.debug.calls[0].args[0]).to.eq('test');
        });
        it('test without timestamp', function() {
            log.$setTimestamp(false);
            expect(log.logger('test')).to.be.an.object;
            expect(Log.debug.calls[0].args[0]).to.eq('test');
        });
        it('test silent', function() {
            log.$setSilent(true);
            expect(log.logger('test')).to.be.an.object;
            expect(Log.debug).to.not.have.been.called;
        });
    });
    describe('$setOutfile', function() {
        let log;

        beforeEach(function() {
            log = new Log();
        });
        it('test called without an argument', function() {
            log.outfile = '';
            expect(log.$setOutfile()).to.be.an.object;
            expect(log.outfile).to.eq(`${p.cwd()}/angie.log`);
        });
        it('test called with an argument', function() {
            log.outfile = '';
            expect(log.$setOutfile('test')).to.be.an.object;
            expect(log.outfile).to.eq('test');
        });
    });
    describe('$setTimestamp', function() {
        let log;

        beforeEach(function() {
            log = new Log();
        });
        it('test called without an argument', function() {
            log.timestamp = '';
            expect(log.$setTimestamp()).to.be.an.object;
            expect(log.timestamp).to.be.true;
        });
        it('test called with an argument', function() {
            log.timestamp = '';
            expect(log.$setTimestamp(false)).to.be.an.object;
            expect(log.timestamp).to.be.false;
        });
    });
    describe('$setLevel', function() {
        let log;

        beforeEach(function() {
            log = new Log();
        });
        it('test called without an argument', function() {
            log.level = '';
            expect(log.$setLevel()).to.be.an.object;
            expect(log.level).to.eq('DEBUG');
        });
        it('test called with a bad argument', function() {
            log.level = '';
            expect(log.$setLevel('test')).to.be.an.object;
            expect(log.level).to.eq('DEBUG');
        });
        it('test called with a good argument', function() {
            log.level = '';
            expect(log.$setLevel('info')).to.be.an.object;
            expect(log.level).to.eq('INFO');
        });
    });
    describe('$setSilent', function() {
        let log;

        beforeEach(function() {
            log = new Log();
        });
        it('test called without an argument', function() {
            log.silent = '';
            expect(log.$setSilent()).to.be.an.object;
            expect(log.silent).to.be.false;
        });
        it('test called with an argument', function() {
            log.silent = '';
            expect(log.$setSilent(true)).to.be.an.object;
            expect(log.silent).to.be.true;
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
        it('bold', function() {
            Log.bold('test', 'test');
            expect(console.log.calls[0].args[0]).to.eq(bold('test', 'test'));
        });
        it('info', function() {
            Log.info('test\n', 'test\n');
            expect(console.log.calls[0].args[0]).to.eq(
                bold.apply(null, [
                    chalk.green('[test] INFO :'),
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
                    '[test] DEBUG :',
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
                    chalk.yellow('[test] WARN :'),
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
                    chalk.red('[test] ERROR :'),
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
                    chalk.red('[test] ERROR :'),
                    'stack',
                    'test ',
                    '\r'
                ])
            );
        });
    });
});