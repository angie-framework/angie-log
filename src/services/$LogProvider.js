/**
 * @module $LogProvider.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 8/23/2015
 */

// System Modules
import fs from      'fs';
import chalk from   'chalk';

const p = process,
      bold = chalk.bold,
      LOG_LEVELS = {
          error: 'ERROR',
          warn: 'WARN',
          debug: 'DEBUG',
          info: 'INFO'
      },
      DEFAULT_LOG_FILE = `${p.cwd()}/angie.log`;

// Message Array to watch and log
let messages = [];

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
    constructor(
        outfile = DEFAULT_LOG_FILE,
        timestamp = true,
        level = 'DEBUG',
        silent = false
    ) {

        // Account for object arguments
        [ this.outfile, this.timestamp, this.level, this.silent ] =
            typeof outfile === 'object' ? [
                outfile.hasOwnProperty('outfile') ||
                    outfile.hasOwnProperty('file') ? outfile.outfile ||
                        outfile.file : DEFAULT_LOG_FILE,
                outfile.hasOwnProperty('timestamp') ?
                    outfile.timestamp : timestamp,
                outfile.hasOwnProperty('level') ||
                outfile.hasOwnProperty('logLevel') ?
                    outfile.level || outfile.logLevel : level,
                outfile.hasOwnProperty('silent') ? outfile.silent : silent
            ] : [ outfile, timestamp, level, silent ];

        // Check the log level and make sure it is an acceptable value
        this.$setLevel(this.level);

        // Observe the messages array, logging a record each time a message is
        // added
        let me = this;
        Object.observe(messages, function() {
            let message = messages.shift();

            // Forcibly add a hard return if one does not exist
            message = !/.*(\r|\n)/.test(message) ? `${message}\n` : message;

            // Write to the output file
            fs.appendFile(me.outfile, message);
        }, [ 'add' ]);
    }

    /**
     * @desc $LogProvider.logger will add a log statement for each call that is
     * made. It pushes messages to an asynchronous queue, which will execute as
     * messages are added.
     * @since 0.0.2
     * @param {string} out The message to add to the log
     * @access public
     * @example new $LogProvider(output.log, true, 'DEBUG', false).logger('test');
     */
    logger(out) {
        messages.push(
            `[${this.timestamp ? new Date().toString() : ''}] ` +
            `${this.level} : ` + out
        );
        if (this.silent !== true) {
            $LogProvider[ this.level.toLowerCase() ](out);
        }
        return this;
    }

    /**
     * @desc Set the file to which the logger records
     * @since 0.0.2
     * @param {string} o [param=p.cwd() + '/angie.log'] The file to which
     * messages are logged
     * @access private
     * @example new $LogProvider().$setlogger('./angie.log');
     */
    $setOutfile(o = DEFAULT_LOG_FILE) {
        this.outfile = o;
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
        this.timestamp = t;
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
        l = l || this.level;
        this.level = LOG_LEVELS[
            LOG_LEVELS.hasOwnProperty(l) ? l : 'debug'
        ];
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
        this.silent = s;
        return this;
    }

    /**
     * @desc A wrapper for bold output
     * @since 0.0.2
     * @param {string} s One or many string inputs
     * @access public
     * @example new $LogProvider.bold('test');
     */
    static bold() {
        console.log(bold(...$carriage(...arguments)));
    }

    /**
     * @desc A wrapper for INFO output
     * @since 0.0.2
     * @param {string} s One or many string inputs
     * @access public
     * @example new $LogProvider.info('test');
     */
    static info() {
        let args = $carriage(...arguments);
        args.unshift(chalk.green(`[${new Date().toString()}] INFO :`));
        args.push('\r');
        console.log(bold.apply(null, args));
    }

    /**
     * @desc A wrapper for DEBUG output
     * @since 0.0.2
     * @param {string} s One or many string inputs
     * @access public
     * @example new $LogProvider.debug('test');
     */
    static debug() {
        let args = $carriage(...arguments);
        args.unshift(`[${new Date().toString()}] DEBUG :`);
        args.push('\r');
        console.log(bold.apply(null, args));
    }

    /**
     * @desc A wrapper for WARN output
     * @since 0.0.2
     * @param {string} s One or many string inputs
     * @access public
     * @example new $LogProvider.warn('test');
     */
    static warn() {
        let args = $carriage(...arguments);
        args.unshift(chalk.yellow(`[${new Date().toString()}] WARN :`));
        args.push('\r');
        console.warn(bold.apply(null, args));
    }

    /**
     * @desc A wrapper for ERROR output
     * @since 0.0.2
     * @param {string} s One or many string inputs
     * @access public
     * @example new $LogProvider.error('test');
     */
    static error() {
        let args = $carriage(...arguments);
        if (args && args[0].stack) {
            args[0] = args[0].stack;
        }
        args.unshift(
            chalk.red(`[${new Date().toString()}] ERROR :`));
        args.push('\r');
        console.error(bold.apply(null, args));
    }
}

// Helper function to drop hard returns in between arguments
function $carriage() {
    let args = Array.prototype.slice.call(arguments);
    return args.map((v) => v.replace ? v.replace(/(\r|\n)/g, ' ') : v);
}

export default $LogProvider;