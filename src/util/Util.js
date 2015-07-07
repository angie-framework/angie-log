'use strict'; 'use strong';

class Util {
    static $carriage() {
        let args = Array.prototype.slice.call(arguments);
        return args.map((v) => v.replace ? v.replace('\r\n', ' ') : v);
    }
}

export default Util;