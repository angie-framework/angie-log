'use strict'; 'use strong';

// System Modules
import fs from                  'fs';

// Test Modules
import {expect} from            'chai';
import simple, {mock} from      'simple-mock';

// Angie Log Modules
import {default as Log} from    '../../../src/services/$LogProvider';

describe('$LogProvider', function() {
    const noop = () => undefined;

    describe('constructor', function() {
        beforeEach(function() {
            mock(Object, 'observe', noop);
            mock(fs, 'appendFile', noop);
        });
        it('test contructor object arguments', function() {
            let log = new Log({
                outfile: 'test',
                timestamp: false,
                level: 'info',
                silent: true
            });
            expect(Object.observe.calls[0].args[0]).to.deep.eq(log.messages);
            expect(Object.observe.calls[0].args[1]).to.be.a.function;
            expect(Object.observe.calls[0].args[2]).to.deep.eq([ 'add' ]);
            expect(log.outfile).to.eq('test');
            expect(log.timestamp).to.be.false;
            expect(log.level).to.be('info');
            expect(log.silent).to.be.true;
        });
        it('test constructor arguments', function() {

        });
        it('test invalid log level', function() {

        });
        it('test Observer called with message', function() {

        });
        it('test Observer called with message \\r\\n', function() {

        });
    });
});