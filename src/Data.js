module.exports = (function() {
    function wordToBits( word ) {
        var rv = [], i;
        
        for(i = 0; i < 32; i++) {
            rv.push( ((word & (1 << (31 - i))) !== 0) ? 1 : 0 );
        }

        return rv;
    }

    function wordsToBits( words ) {
        // Convert a sequence of 32-bit words to a sequence of bits.
        var rv = [], i;

        for(i = 0; i < words.length; i++) {
            rv = rv.concat( wordToBits( words[ i ] ) );
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
                if( bits[ i * 32 + j ] !== 0 ) {
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
        bitsToWords: bitsToWords
    };
})();
