module.exports = (function() {
    function _zero( x ) {
        // This is enough to allow both strings and lists.
        // Lists are convenient for building.
        // Strings are convenient to format to from bignums.
        return x === 0 || x === '0';
    }

    function lowerOrderBits( s, n ) {
        if( s.length <= n ) {
            return s;
        }
        
        return s.slice( s.length - n );
    }

    function wordToBits( word ) {
        var rv = [], i;
        
        for(i = 0; i < 32; i++) {
            rv.push( ((word & (1 << (31 - i))) !== 0) ? 1 : 0 );
        }

        return rv.join("");
    }

    function wordsToBits( words ) {
        // Convert a sequence of 32-bit words to a sequence of bits.
        var rv = "", i;

        for(i = 0; i < words.length; i++) {
            rv += wordToBits( words[ i ] );
        }

        return rv;
    }

    function bitsToWords( bits ) {
        var n = bits.length / 32,
            rv = [],
            current, i, j;

        if( (n%1) !== 0 ) {
            throw new Error( "not an even sequence of words" );
        }

        for(i = 0; i < n; i++) {
            current = 0;
            for(j = 0; j < 32; j++) {
                if( !_zero( bits[ i * 32 + j ] ) ) {
                    current |= 1 << (31 - j);
                }
            }
            rv.push( current );
        }

        return rv;
    }

    return {
        wordsToBits: wordsToBits,
        wordToBits: wordToBits,
        bitsToWords: bitsToWords,
        lowerOrderBits: lowerOrderBits
    };
})();
