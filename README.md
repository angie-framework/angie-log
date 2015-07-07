## Angie Logs

This is a very slim terminal and outfile logger for iojs/NodeJS ES6 projects. It will work standalone, or as an extension to the [Angie MVC](https://github.com/benderTheCrime/angie).

![build status](https://travis-ci.org/benderTheCrime/angie-log.svg?branch=debug-travis "build status")
![iojs support](https://img.shields.io/badge/iojs-1.7.1+-brightgreen.svg "iojs support")
![node support](https://img.shields.io/badge/node-0.12.0+-brightgreen.svg "node support")
![code coverage](https://rawgit.com/benderTheCrime/angie-log/master/svg/coverage.svg "code coverage")
![npm downloads](https://img.shields.io/npm/dm/angie-log.svg "npm downloads")

[![NPM](https://nodei.co/npm/angie-log.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/angie-log/)

### Usage
```bash
npm i -g angie-log
angie-log help
```
```javascript
import {default as Log} from 'angie-log';

// Call a new logger with defaults
let log = new Log({
    outfile:    'log.log', // defaults to p.cwd() + '/angie.log'
    file:       'log.log',
    timestamp:  true,
    level:      'debug', // info, debug, warn, error
    silent:     false
});

// Output to log.log
log.logger('test');

// $setOutfile to change the output file
log.$setOutfile(`${p.cwd()}/angie.log`);

// $setTimestamp to toggle timestamps in the log output
log.$setTimestamp(true);

// $setLevel to change the log level
log.$setLevel(true);

// $setSilent to prevent terminal output
log.$setSilent(true);

// Explicitly call the prettified terminal output
Log.info('test');
Log.debug('test');
Log.warn('test');
Log.error('test');
```

### Angie
Please see the [site](http://benderthecrime.github.io/angie/#/about) for news, a quickstart guide, and documentation and the [CHANGELOG](https://github.com/benderTheCrime/angie/blob/master/CHANGELOG.md) for an up to date list of changes.
