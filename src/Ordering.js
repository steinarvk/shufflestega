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

        return Data.lowerOrderBits( bits, nbits );
    }

    return {
        bitsToOrdering: bitsToOrdering,
        orderingToBits: orderingToBits
    };
})();
