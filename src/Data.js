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

    function _unsignedToBits( x, l ) {
        var rv = [], i;
        
        for(i = 0; i < l; i++) {
            rv.push( ((x & (1 << (l - 1 - i))) !== 0) ? 1 : 0 );
        }

        return rv.join("");        
    }

    function wordToBits( word ) {
        return _unsignedToBits( word, 32 );
    }

    function byteToBits( x ) {
        return _unsignedToBits( x, 8 );
    }

    function wordsToBits( words ) {
        // Convert a sequence of 32-bit words to a sequence of bits.
        var rv = "", i;

        for(i = 0; i < words.length; i++) {
            rv += wordToBits( words[ i ] );
        }

        return rv;
    }

    function bitsToNum( bits ) {
        var rv = 0,
            i;

        for(i = 0; i < bits.length; i++) {
            if( !_zero( bits[ i ] ) ) {
                rv |= 1 << (bits.length - 1 - i);
            }
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

    function wordArrayToBits( wordarray ) {
        var i, wi, bi, bc, rv = "";
        
        for(i = 0; i < wordarray.sigBytes; i++) {
            wi = Math.floor( i / 4 );
            bi = i % 4;
            bc = wordarray.words[ wi ] >> ((3-bi) * 8) & 0xff;
            
            rv += byteToBits( bc );
        }

        return rv;
    }
    
    function bitsToWordArray( bits ) {
        var i = 0, j, currentbit, current, rv = [];

        if( (bits.length % 8) !== 0 ) {
            throw new Error( "WordArray format can't encode partial bytes" );
        }

        while(i < bits.length) {
            rv.push( 0 );
            for(j = 0; j < 32 && i < bits.length; j++) {
                currentbit = 1 << (31 - j);

                if( !_zero( bits[ i ] ) ) {
                    rv[ rv.length - 1] |= currentbit;
                }

                i++;
            }
        }

        return { words: rv,
                 sigBytes: bits.length / 8 };
    }

    return {
        wordsToBits: wordsToBits,
        wordToBits: wordToBits,
        byteToBits: byteToBits,
        bitsToNum: bitsToNum,
        bitsToWords: bitsToWords,
        lowerOrderBits: lowerOrderBits,
        bitsToWordArray: bitsToWordArray,
        wordArrayToBits: wordArrayToBits
    };
})();
