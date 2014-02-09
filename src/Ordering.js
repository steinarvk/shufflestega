var Crypto = require("./AESCrypto");
var Bignum = require("./Bignum");
var Data = require("./Data");

module.exports = (function() {
    function bitsToOrdering( bits, n ) {
        var num = Bignum.fromBits( bits ),
            padded = Bignum.addRandomSequencePadding( num,
                                                      bits.length,
                                                      n,
                                                      Crypto.randomBool );
        return Bignum.toOrdering( padded, n );
    }

    function orderingToBits( ordering, nbits ) {
        var num = Bignum.fromOrdering( ordering ),
            bits = Bignum.toBits( num );

        while( bits.length < nbits ) {
            bits = "0" + bits;
        }

        return Data.lowerOrderBits( bits, nbits );
    }

    function canonicalizeOrdering( ordering ) {
        var max, min, i;

        if( ordering.length < 1 ) {
            throw new Error( "invalid ordering" );
        }

        max = min = ordering[ 0 ];

        for(i = 0; i < ordering.length; i++) {
            if( typeof ordering[ i ] !== "number" || (i%1) !== 0 ) {
                throw new Error( "invalid ordering (non-integer)" );
            }
            max = Math.max( max, ordering[ i ] );
            min = Math.min( min, ordering[ i ] );
        }

        if( ordering.length !== (max - min + 1) ) {
            throw new Error( "invalid ordering (gaps or repeated elements)" );
        }

        return ordering.map( function(x) {
            return x - min;
        } );
    }

    return {
        bitsToOrdering: bitsToOrdering,
        orderingToBits: orderingToBits,
        canonicalizeOrdering: canonicalizeOrdering
    };
})();
