'use strict'; 'use strong';

// System Modules
import fs from      'fs';
import chalk from   'chalk';

// Angie Log Modules
import Util from    '../util/Util';

const p = process,
      bold = chalk.bold,
      LOG_LEVELS = {
          error: 'ERROR',
          warn: 'WARN',
          debug: 'DEBUG',
          info: 'INFO'
      };

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
     * @param {string} outfile.outfile [param='./angie.log'] The file to which
     * messages are logged
     * @param {boolean} outfile.timestamp [param=true] Whether or not to include
     * a timestamp in the log output
     * @param {string} outfile.level [param='DEBUG'] The recorded log message
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
        outfile = `${p.cwd()}angie.log`,
        timestamp = true,
        level = 'DEBUG',
        silent = false
    ) {

        // Account for object arguments
        [ this.outfile, this.timestamp, this.level, this.silent ] =
            typeof outfile === 'object' ? [
                outfile.outfile || outfile.file || outfile,
                outfile.timestamp || timestamp,
                outfile.level || outfile.logLevel || level,
                outfile.silent || silent
            ] : [ outfile, timestamp, level, silent ];

        // Check the log level and make sure it is an acceptable value
        this.$setLevel(this.level);

        // Observe the messages array, logging a record each time a message is
        // added
        let me = this;
        Object.observe((this.messages = []), function() {
            let message = me.messages.shift();

            // For all of the messages
            // TODO does this have to be a while loop?
            // while (message = me.messages.shift()) {
            //
            //     // Forcibly add a hard return if one does not exist
            message = !/.*(\r|\n)/.test(message) ? `${message}\n` : message;
            //
            //     // Write to the output file
            fs.appendFile(me.outfile, message);
            // }
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
        this.messages.push(
            `[${this.timestamp ? new Date().toString() : ''}]` +
            `[${this.level}]: ` + out
        );
        if (this.silent !== true) {
            $LogProvider[ this.level.toLowerCase() ](out);
        }
    }

    /**
     * @desc Set the file to which the logger records
     * @since 0.0.2
     * @param {string} o [param='./angie.log'] The file to which messages are
     * logged
     * @access private
     * @example new $LogProvider().$setlogger('./angie.log');
     */
    $setOutfile(o = `${p.cwd()}angie.log`) {
        this.outfile = o;
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
    }

    /**
     * @desc A wrapper for bold output
     * @since 0.0.2
     * @param {string} s One or many string inputs
     * @access public
     * @example new $LogProvider.bold('test');
     */
    static bold() {
        return console.log(bold.apply(null, arguments));
    }

    /**
     * @desc A wrapper for INFO output
     * @since 0.0.2
     * @param {string} s One or many string inputs
     * @access public
     * @example new $LogProvider.info('test');
     */
    static info() {
        let args = Util.$carriage.apply(null, arguments);
        args.unshift(chalk.green(`[${new Date().toString()}][INFO]:`));
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
        let args = Util.$carriage.apply(null, arguments);
        args.unshift(`[${new Date().toString()}][DEBUG]:`);
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
        let args = Util.$carriage.apply(null, arguments);
        args.unshift(chalk.yellow(`[${new Date().toString()}][WARN]:`));
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
        let args = Util.$carriage.apply(null, arguments);
        if (args && args[0].stack) {
            args[0] = args[0].stack;
        }
        args.unshift(
            chalk.red(`[${new Date().toString()}][ERROR]:`));
        args.push('\r');
        console.error(bold.apply(null, args));
    }

    /**
     * @desc A wrapper for REPL line starts
     * @since 0.0.2
     * @access private
     * @example new $LogProvider.$shell();
     */
    static $shell() {
        return chalk.cyan(bold('ANGIE > '));
    }
}

export default $LogProvider;