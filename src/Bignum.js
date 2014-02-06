var BigInteger = require("biginteger").BigInteger;

module.exports = (function() {
    function factorial(n) {
        var rv = BigInteger( "1" ), i = 2;

        while( i <= n ) {
            rv = rv.multiply( i );
            i += 1;
        }

        return rv.toString();
    }

    return {
        factorial: factorial
    };
})();
