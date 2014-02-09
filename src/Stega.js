var Bignum = require("./Bignum");
var Data = require("./Data");
var Ordering = require("./Ordering");

module.exports = {
    create: function(codec, crypto) {
        function hideSync(message, password, n) {
            var nbits = Bignum.sequenceBits( n ),
                encryptor = crypto.encryptor( nbits ),
                encoder = codec.encoder( encryptor.plaintextBits() ),
                encoded = encoder.encode( message ),
                encryptedWords = encryptor.encryptSync( encoded, password ),
                encryptedBits = Data.wordsToBits( encryptedWords ),
                ordering = Ordering.bitsToOrdering( encryptedBits, n );

            return ordering;
        }

        function extractSync(ordering, password) {
            var n = ordering.length,
                nbits = Bignum.sequenceBits( n ),
                decryptor = crypto.decryptor( nbits ),
                decoder = codec.decoder( decryptor.plaintextBits() ),
                encryptedBits = Ordering.orderingToBits(
                    ordering,
                    decryptor.cryptotextBits() ),
                encryptedWords = Data.bitsToWords( encryptedBits ),
                encoded = decryptor.decryptSync( encryptedWords, password ),
                message = decoder.decode( encoded );

            return message;
        }

        return {
            hideSync: hideSync,
            extractSync: extractSync
        };
    }
};
