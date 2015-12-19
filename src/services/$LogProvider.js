/**
 * @module $LogProvider.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/23/2015
 */

// System Modules
import fs from                  'fs';
import chalk, { bold } from     'chalk';

const CWD = process.cwd(),
    LOG_LEVELS = {
        error: 'ERROR',
        warn: 'WARN',
        debug: 'DEBUG',
        info: 'INFO'
    },
    DEFAULT_LOG_FILE = 'angie.log';

/**
 * @desc $LogProvider is the only class in the Angie Logging module. This module
 * allows for logging to the terminal (with a little flavor).
 *
 * This can also be referenced as Log
 * @since 0.0.2
 * @access public
 * @example new $LogProvider();
 */
class $LogProvider {

    /**
     * @desc Instantiate a logger for use in the current module.
     * @since 0.0.2
     * @param {string|object} outfile The file to which messages are logged, or
     * a hash of options to pass the logger
     * @param {string} outfile.outfile [param=process.cwd() + '/angie.log'] The file
     * to which messages are logged
     * @param {string} outfile.file [param=process.cwd() + '/angie.log'] The file to
     * which messages are logged. All files will be relative to process.cwd().
     * @param {string} outfile.name The name of the logger to be recorded in the
     * log file
     * @param {boolean} outfile.timestamp [param=true] Whether or not to include
     * a timestamp in the log output
     * @param {string} outfile.level [param='DEBUG'] The recorded log message
     * level. Possible options: debug, error, info, warn
     * @param {string} outfile.logLevel [param='DEBUG'] The recorded log message
     * level. Possible options: debug, error, info, warn
     * @param {boolean} outfile.silent [param=false] The recorded log message
     * level. Possible options: debug, error, info, warn
     * @param {string} name The name of the logger to be recorded in the
     * log file
     * @param {boolean} timestamp [param=true] Whether or not to include a
     * timestamp in the log output
     * @param {string} level [param='DEBUG'] The recorded log message level.
     * Possible options: debug, error, info, warn
     * @param {boolean} silent [param=false] Should the log output also log to
     * the terminal?
     * @access public
     * @example new $LogProvider(output.log, 'test', true, 'DEBUG', false);
     */
    constructor(
        outfile = DEFAULT_LOG_FILE,
        name = null,
        timestamp = true,
        level = [ 'DEBUG' ],
        silent = false,
        messages = []
    ) {

        // Account for object arguments
        [
            this.$$outfile,
            this.$$name,
            this.$$timestamp,
            this.$$silent,
            this.$$messages
        ] = typeof outfile === 'object' ? [
            `${CWD}/${
                outfile.hasOwnProperty('outfile') || outfile.hasOwnProperty('file') ?
                    removeLeadingSlashes(outfile.outfile || outfile.file) :
                        DEFAULT_LOG_FILE
            }`,
            outfile.hasOwnProperty('name') ? outfile.name : name,
            outfile.hasOwnProperty('timestamp') ? outfile.timestamp : timestamp,
            outfile.hasOwnProperty('silent') ? outfile.silent : silent,
            outfile.hasOwnProperty('messages') ? outfile.messages : messages
        ] : [
            `${CWD}/${removeLeadingSlashes(outfile)}`,
            name,
            timestamp,
            silent,
            messages
        ];

        // Check the log level and make sure it is an acceptable value
        if (typeof outfile === 'object') {
            if (outfile.hasOwnProperty('level')) {
                level = outfile.level;
            } else if (outfile.hasOwnProperty('logLevel')) {
                level = outfile.logLevel;
            } else if (outfile.hasOwnProperty('levels')) {
                level = outfile.levels;
            } else if (outfile.hasOwnProperty('logLevels')) {
                level = outfile.logLevels;
            }
        }

        // Cast level to an Array if it is a string
        level = typeof level === 'string' ? [ level ] : level;

        // Make sure we properly set up the level
        this.$setLevels(level);

        // Backup the original level type
        this.$$initialLevel = [ ...this.$$level ];

        // Observe the messages array, logging a record each time a message is
        // added
        let me = this;
        Object.observe(this.$$messages, function() {
            let message = me.$$messages.shift();

            // Forcibly add a hard return if one does not exist
            message = !/.*(\r|\n)$/.test(message) ? `${message}\n` : message;

            // Write to the output file
            fs.appendFile(me.$$outfile, message);
        }, [ 'add' ]);
    }

    /**
     * @desc Logs an error to an outfile and to the terminal (unless otherwise
     * specified). Allows any any arguments.
     * @since 0.9.7
     * @access public
     * @example new $LogProvider({ ...args }).error('test');
     */
    error() {
        return this.$$filter('error', ...arguments);
    }

    /**
     * @desc Logs a warning to an outfile and to the terminal (unless otherwise
     * specified). Allows any any arguments.
     * @since 0.9.7
     * @access public
     * @example new $LogProvider({ ...args }).warn('test');
     */
    warn() {
        return this.$$filter('warn', ...arguments);
    }

    /**
     * @desc Logs a debug message to an outfile and to the terminal (unless
     * otherwise specified). Allows any any arguments.
     * @since 0.9.7
     * @access public
     * @example new $LogProvider({ ...args }).debug('test');
     */
    debug() {
        return this.$$filter('debug', ...arguments);
    }

    /**
     * @desc Logs info to an outfile and to the terminal (unless otherwise
     * specified)
     * @since 0.9.7
     * @access public
     * @example new $LogProvider({ ...args }).info('test');
     */
    info() {
        return this.$$filter('info', ...arguments);
    }

    /**
     * @desc Set the file to which the logger records. All files will be
     * relative to `process.cwd()`.
     * @since 0.0.2
     * @param {string} o [param=process.cwd() + '/angie.log'] The file to which
     * messages are logged. All files will be relative to `process.cwd()`.
     * @access private
     * @example new $LogProvider().$setlogger('./angie.log');
     */
    $setOutfile(o = DEFAULT_LOG_FILE) {
        this.$$outfile = `${CWD}/${removeLeadingSlashes(o)}`;
        return this;
    }

    /**
     * @desc Set the name of the logger recorded
     * @since 0.9.7
     * @param {string} n The name of the logger to be recorded in the log file
     * @access private
     * @example new $LogProvider().$setName('logger');
     */
    $setName(n) {

        // Check this explicitly to make sure it is not called with an empty
        if (n) {
            this.$$name = n;
        }
        return this;
    }

    /**
     * @desc Set the logger timestamp preference
     * @since 0.0.2
     * @param {boolean} t [param=true] Whether or not to include a timestamp in
     * the log output
     * @access private
     * @example new $LogProvider().$setTimestamp(true);
     */
    $setTimestamp(t = true) {
        this.$$timestamp = t;
        return this;
    }

    /**
     * @desc Set the log level
     * @since 0.0.2
     * @param {string} l The recorded log message level.
     * Possible options: debug, error, info, warn
     * @access private
     * @example new $LogProvider().$setLevel('debug');
     */
    $setLevel(l) {

        // Just a little insurance...
        if (!(this.$$level instanceof Set)) {
            this.$$level = new Set();
        }

        // If l exists, check to see if it is a valid log level and set the level
        if (l) {
            let level = LOG_LEVELS[
                LOG_LEVELS.hasOwnProperty(l) ? l : 'debug'
            ];
            this.$$level.add(level);
        }
        return this;
    }

    /**
     * @desc Set the log level to many level strings
     * @since 0.9.8
     * @param {Array} l The recorded log message level array.
     * Possible options: debug, error, info, warn
     * @access private
     * @example new $LogProvider().$setLevels([ 'debug', 'info' ]);
     */
    $setLevels(l) {
        let me = this;

        // This function only takes an Array of level argument strings
        if (l instanceof Array && l.length) {
            this.$$level = new Set();

            // Attempt to add the level to the set for each level
            l.forEach(function(level) {
                me.$setLevel(level);
            });
        }
        return this;
    }

    /**
     * @desc Set the logger silent preference
     * @since 0.0.2
     * @param {boolean} s [param=false] Should the log output also log to
     * the terminal?
     * @access private
     * @example new $LogProvider().$setTimestamp(false);
     */
    $setSilent(s = false) {
        this.$$silent = s;
        return this;
    }

    /**
     * @desc Checks to see that the specified log level in the instantiated
     * logger is observed
     * @since 0.9.7
     * @access private
     */
    $$filter() {
        let level = LOG_LEVELS[ arguments[0] ];

        // Check to see that the log level of the declared logger matches that
        // of the called method
        if (level && this.$$level.has(level)) {
            return this.$$logger.apply(this, arguments);
        }
        return this;
    }

    /**
     * @desc $LogProvider.prototpye$$logger will add a log statement for each
     * call that is made. It pushes messages to an asynchronous queue, which
     * will execute as messages are added. Note: if this method is called
     * explicitly, the first argument will have to be a valid log level
     * @since 0.0.2
     * @param {string} level The level of log output to put into the log
     * @access private
     * @example new $LogProvider(output.log, true, 'DEBUG', false).logger('test');
     */
    $$logger() {
        let args = Array.prototype.slice.call(arguments),
            level = args.shift();

        if (!LOG_LEVELS.hasOwnProperty(level)) {
            $LogProvider.warn(
                `${this.$$name ? `[${chalk.cyan(this.$$name)}] ` : ''}$$logger ` +
                'called explicitly without a valid log level'
            );
            return this;
        }

        // Modify the output string
        let message = new Array(args);
        message.unshift(
            `${this.$$timestamp ? `[${new Date().toString()}] ` : ''}` +
            `[${LOG_LEVELS[ level ]}]` +
            `${this.$$name ? ` [${this.$$name}]` : ''} :`
        );

        // Avoid space before return
        message = `${message.join(' ')}\r`;

        // Push a message to the Array of messages obseved
        this.$$messages.push(message);

        // Log the message in the terminal as well unless silent
        if (this.$$silent !== true) {
            $LogProvider[ level ](args);
        }
        return this;
    }

    /**
     * @desc Reset the log level to the original specified log level
     * @since 0.9.7
     * @access private
     */
    $$resetLevels() {
        return this.$setLevels(this.$$initialLevel);
    }

    /**
     * @desc A wrapper for ERROR output
     * @since 0.0.2
     * @param {string} s One or many string inputs
     * @access public
     * @example new $LogProvider.error('test');
     */
    static error() {
        let args = carriage(...arguments);
        if (args && args[0].stack) {
            args[0] = args[0].stack;
        }
        args.unshift(
            chalk.red(`[${new Date().toString()}] [ERROR] :`));
        args.push('\r');
        console.error(bold.apply(null, args));
    }

    /**
     * @desc A wrapper for WARN output
     * @since 0.0.2
     * @param {string} s One or many string inputs
     * @access public
     * @example new $LogProvider.warn('test');
     */
    static warn() {
        let args = carriage(...arguments);
        args.unshift(chalk.yellow(`[${new Date().toString()}] [WARN] :`));
        args.push('\r');
        console.warn(bold.apply(null, args));
    }

    /**
     * @desc A wrapper for DEBUG output
     * @since 0.0.2
     * @param {string} s One or many string inputs
     * @access public
     * @example new $LogProvider.debug('test');
     */
    static debug() {
        let args = carriage(...arguments);
        args.unshift(`[${new Date().toString()}] [DEBUG] :`);
        args.push('\r');
        console.log(bold.apply(null, args));
    }

    /**
     * @desc A wrapper for INFO output
     * @since 0.0.2
     * @param {string} s One or many string inputs
     * @access public
     * @example new $LogProvider.info('test');
     */
    static info() {
        let args = carriage(...arguments);
        args.unshift(chalk.green(`[${new Date().toString()}] [INFO] :`));
        args.push('\r');
        console.log(bold.apply(null, args));
    }
}

/**
 * @desc Helper function to drop hard returns in between arguments
 * @since 0.0.2
 * @access private
 */
function carriage() {
    let args = Array.prototype.slice.call(arguments);
    return args.map((v) => v && v.replace ? v.replace(/(\r|\n)/g, ' ') : v);
}

/**
 * @desc Helper function to remove leading argument slashes
 * @since 0.9.7
 * @access private
 */
function removeLeadingSlashes(str) {
    return str.replace(/(^(\/))/, '');
}

// Declare the module in the Angie app space
if (
    typeof app === 'object' &&
    typeof app.factory === 'function'
) {
    app.factory('$Log', $LogProvider);
}

export default $LogProvider;