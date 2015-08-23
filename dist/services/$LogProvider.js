/**
 * @module $LogProvider.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/23/2015
 */

// System Modules
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var p = process,
    _bold = _chalk2['default'].bold,
    LOG_LEVELS = {
    error: 'ERROR',
    warn: 'WARN',
    debug: 'DEBUG',
    info: 'INFO'
},
    DEFAULT_LOG_FILE = p.cwd() + '/angie.log';

// Message Array to watch and log
var messages = [];

/**
 * @desc $LogProvider is the only class in the Angie Logging module. This module
 * allows for logging to the terminal (with a little flavor).
 *
 * This can also be referenced as Log
 * @since 0.0.2
 * @access public
 * @example new $LogProvider();
 */

var $LogProvider = (function () {

    /**
     * @desc Instantiate a logger for use in the current module.
     * @since 0.0.2
     * @param {string|object} outfile The file to which messages are logged, or
     * a hash of options to pass the logger
     * @param {string} outfile.outfile [param=p.cwd() + '/angie.log'] The file
     * to which messages are logged
     * @param {string} outfile.file [param=p.cwd() + '/angie.log'] The file to
     * which messages are logged
     * @param {boolean} outfile.timestamp [param=true] Whether or not to include
     * a timestamp in the log output
     * @param {string} outfile.level [param='DEBUG'] The recorded log message
     * level. Possible options: debug, error, info, warn
     * @param {string} outfile.logLevel [param='DEBUG'] The recorded log message
     * level. Possible options: debug, error, info, warn
     * @param {boolean} outfile.silent [param=false] The recorded log message
     * level. Possible options: debug, error, info, warn
     * @param {boolean} timestamp [param=true] Whether or not to include a
     * timestamp in the log output
     * @param {string} level [param='DEBUG'] The recorded log message level.
     * Possible options: debug, error, info, warn
     * @param {boolean} silent [param=false] Should the log output also log to
     * the terminal?
     * @access public
     * @example new $LogProvider(output.log, true, 'DEBUG', false);
     */

    function $LogProvider() {
        var outfile = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_LOG_FILE : arguments[0];
        var timestamp = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
        var level = arguments.length <= 2 || arguments[2] === undefined ? 'DEBUG' : arguments[2];
        var silent = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

        _classCallCheck(this, $LogProvider);

        // Account for object arguments

        var _ref = typeof outfile === 'object' ? [outfile.hasOwnProperty('outfile') || outfile.hasOwnProperty('file') ? outfile.outfile || outfile.file : DEFAULT_LOG_FILE, outfile.hasOwnProperty('timestamp') ? outfile.timestamp : timestamp, outfile.hasOwnProperty('level') || outfile.hasOwnProperty('logLevel') ? outfile.level || outfile.logLevel : level, outfile.hasOwnProperty('silent') ? outfile.silent : silent] : [outfile, timestamp, level, silent];

        var _ref2 = _slicedToArray(_ref, 4);

        this.outfile = _ref2[0];
        this.timestamp = _ref2[1];
        this.level = _ref2[2];
        this.silent = _ref2[3];

        // Check the log level and make sure it is an acceptable value
        this.$setLevel(this.level);

        // Observe the messages array, logging a record each time a message is
        // added
        var me = this;
        Object.observe(messages, function () {
            var message = messages.shift();

            // Forcibly add a hard return if one does not exist
            message = !/.*(\r|\n)/.test(message) ? message + '\n' : message;

            // Write to the output file
            _fs2['default'].appendFile(me.outfile, message);
        }, ['add']);
    }

    _createClass($LogProvider, [{
        key: 'logger',

        /**
         * @desc $LogProvider.logger will add a log statement for each call that is
         * made. It pushes messages to an asynchronous queue, which will execute as
         * messages are added.
         * @since 0.0.2
         * @param {string} out The message to add to the log
         * @access public
         * @example new $LogProvider(output.log, true, 'DEBUG', false).logger('test');
         */
        value: function logger(out) {
            messages.push('[' + (this.timestamp ? new Date().toString() : '') + '] ' + (this.level + ' : ') + out);
            if (this.silent !== true) {
                $LogProvider[this.level.toLowerCase()](out);
            }
            return this;
        }
    }, {
        key: '$setOutfile',

        /**
         * @desc Set the file to which the logger records
         * @since 0.0.2
         * @param {string} o [param=p.cwd() + '/angie.log'] The file to which
         * messages are logged
         * @access private
         * @example new $LogProvider().$setlogger('./angie.log');
         */
        value: function $setOutfile() {
            var o = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_LOG_FILE : arguments[0];

            this.outfile = o;
            return this;
        }
    }, {
        key: '$setTimestamp',

        /**
         * @desc Set the logger timestamp preference
         * @since 0.0.2
         * @param {boolean} t [param=true] Whether or not to include a timestamp in
         * the log output
         * @access private
         * @example new $LogProvider().$setTimestamp(true);
         */
        value: function $setTimestamp() {
            var t = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

            this.timestamp = t;
            return this;
        }
    }, {
        key: '$setLevel',

        /**
         * @desc Set the log level
         * @since 0.0.2
         * @param {string} l The recorded log message level.
         * Possible options: debug, error, info, warn
         * @access private
         * @example new $LogProvider().$setLevel('debug');
         */
        value: function $setLevel(l) {
            l = l || this.level;
            this.level = LOG_LEVELS[LOG_LEVELS.hasOwnProperty(l) ? l : 'debug'];
            return this;
        }
    }, {
        key: '$setSilent',

        /**
         * @desc Set the logger silent preference
         * @since 0.0.2
         * @param {boolean} s [param=false] Should the log output also log to
         * the terminal?
         * @access private
         * @example new $LogProvider().$setTimestamp(false);
         */
        value: function $setSilent() {
            var s = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            this.silent = s;
            return this;
        }
    }], [{
        key: 'bold',

        /**
         * @desc A wrapper for bold output
         * @since 0.0.2
         * @param {string} s One or many string inputs
         * @access public
         * @example new $LogProvider.bold('test');
         */
        value: function bold() {
            console.log(_bold.apply(undefined, _toConsumableArray($carriage.apply(undefined, arguments))));
        }
    }, {
        key: 'info',

        /**
         * @desc A wrapper for INFO output
         * @since 0.0.2
         * @param {string} s One or many string inputs
         * @access public
         * @example new $LogProvider.info('test');
         */
        value: function info() {
            var args = $carriage.apply(undefined, arguments);
            args.unshift(_chalk2['default'].green('[' + new Date().toString() + '] INFO :'));
            args.push('\r');
            console.log(_bold.apply(null, args));
        }
    }, {
        key: 'debug',

        /**
         * @desc A wrapper for DEBUG output
         * @since 0.0.2
         * @param {string} s One or many string inputs
         * @access public
         * @example new $LogProvider.debug('test');
         */
        value: function debug() {
            var args = $carriage.apply(undefined, arguments);
            args.unshift('[' + new Date().toString() + '] DEBUG :');
            args.push('\r');
            console.log(_bold.apply(null, args));
        }
    }, {
        key: 'warn',

        /**
         * @desc A wrapper for WARN output
         * @since 0.0.2
         * @param {string} s One or many string inputs
         * @access public
         * @example new $LogProvider.warn('test');
         */
        value: function warn() {
            var args = $carriage.apply(undefined, arguments);
            args.unshift(_chalk2['default'].yellow('[' + new Date().toString() + '] WARN :'));
            args.push('\r');
            console.warn(_bold.apply(null, args));
        }
    }, {
        key: 'error',

        /**
         * @desc A wrapper for ERROR output
         * @since 0.0.2
         * @param {string} s One or many string inputs
         * @access public
         * @example new $LogProvider.error('test');
         */
        value: function error() {
            var args = $carriage.apply(undefined, arguments);
            if (args && args[0].stack) {
                args[0] = args[0].stack;
            }
            args.unshift(_chalk2['default'].red('[' + new Date().toString() + '] ERROR :'));
            args.push('\r');
            console.error(_bold.apply(null, args));
        }
    }, {
        key: '$shell',

        /**
         * @desc A wrapper for REPL line starts
         * @since 0.0.2
         * @access private
         * @example new $LogProvider.$shell();
         */
        value: function $shell() {
            return _chalk2['default'].cyan(_bold('angie > '));
        }
    }]);

    return $LogProvider;
})();

// Helper function to drop hard returns in between arguments
function $carriage() {
    var args = Array.prototype.slice.call(arguments);
    return args.map(function (v) {
        return v.replace ? v.replace(/(\r|\n)/g, ' ') : v;
    });
}

exports['default'] = $LogProvider;
module.exports = exports['default'];