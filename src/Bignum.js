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

    function _isInteger( n ) {
        return (typeof n === "number") && (n % 1 === 0);
    }

    function validOrdering( ordering ) {
        var i = 0, x, arr = ordering.slice().sort();

        while( i < arr.length ) {
            x = arr[ i ];
            
            if( i > 0 && arr[ i ] === arr[ i - 1 ] ) {
                return false;
            }

            if( !_isInteger( x ) ) {
                return false;
            }

            if( x < 0 || x >= arr.length ) {
                return false;
            }
            
            i += 1;
        }

        return true;
    }

    function fromOrdering( ordering ) {
        var copy, i, j, choice, rv = BigInteger( 0 );

        if( !validOrdering( ordering ) ) {
            throw new Error( "not a valid ordering" );
        }

        copy = ordering.slice();
        
        for(i = 0; i < copy.length; i++) {
            choice = copy[ i ];
            rv = rv.multiply( copy.length - i ).add( choice );

            for(j = i + 1; j < copy.length; j++) {
                if( copy[ j ] > choice ) {
                    copy[ j ] -= 1;
                }
            }
        }

        return rv.toString();
    }

    function _canonicalizeOrdering( relative ) {
        // E.g. [ 0, 0, 0, 0 ] meaning "always the first available choice"
        // to [0, 1, 2, 3, 4 ]
        var canonical = [], i, rv = [], x;
        
        for(i = 0; i < relative.length; i++) {
            canonical.push( i );
        }

        for(i = 0; i < relative.length; i++) {
            x = relative[ i ];
            if( i < 0 || x >= canonical.length ) {
                throw new Error( "invalid relative ordering" );
            }
            rv.push( canonical[ x ] );
            canonical.splice( x, 1 );
        }

        return rv;
    }

    function toOrdering( s, n ) {
        var N = BigInteger( s ),
            i,
            x,
            rv = [];

        for(i = 0; i < n; i++) {
            x = N.remainder( i + 1 ).toJSValue();
            for(j = 0; j < i; j++) {
                if( rv[ j ] < x ) {
                }
            }
            rv.push( x );
            N = N.divide( i + 1 );
        }

        rv.reverse();

        return _canonicalizeOrdering( rv );

        

        

        

        // [ 2, 3, 1, 0 ]
        // 2 out of 4
        // [ 2, 1, 0 ]

        // [ 3, 2, 1, 0 ]


        // rv = 0
        // alternative 3 out of 4, rv *= 4, rv += 3, rv === 3
        // alternative 2 out of 3, rv *= 3, rv += 2, rv === 11
        // alternative 1 out of 2, rv *= 2, rv += 1, rv === 23
        // (alternative 0 out of 1 -- x1, + 0)

        // 23 === (1 + 2 * (2 + 3 * 3)
        //         .        .       .

        // 23 % 2 --> 1, (23-1)/2 --> 11
        // 11 % 3 --> 2, (11-2)/3 --> 3
        // 3 % 4 --> 3
    }

    function fromBits( bits ) {
        return BigInteger( "0b" + bits ).toString();
    }

    function toBits( n ) {
        return BigInteger( n ).toString( 2 );
    }

    return {
        factorial: factorial,
        sequenceBits: sequenceBits,
        validOrdering: validOrdering,
        fromOrdering: fromOrdering,
        toOrdering: toOrdering,
        fromBits: fromBits,
        toBits: toBits
    };
})();
