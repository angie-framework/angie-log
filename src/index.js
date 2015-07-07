'use strict'; 'use strong';

// Angie Log Modules
import $LogProvider from    './services/$LogProvider';
export default $LogProvider;

if (global.app) {
    global.app.service('Log', $LogProvider);
}