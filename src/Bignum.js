var BigInteger = require("biginteger").BigInteger;

module.exports = (function() {
    function _factorial(n) {
        var rv = BigInteger( "1" ), i = 2;

        while( i <= n ) {
            rv = rv.multiply( i );
            i += 1;
        }

        return rv;
    }

    function factorial(n) {
        return _factorial(n).toString();
    }

    function sequenceBits(n) {
        var fac = _factorial( n ),
            x = BigInteger( 1 ),
            bitcount = -1;
        
        while( x.compare( fac ) <= 0 ) {
            bitcount += 1;
            x = x.multiply( 2 );
        }
            
        return bitcount;
    }

    return {
        factorial: factorial,
        sequenceBits: sequenceBits
    };
})();
