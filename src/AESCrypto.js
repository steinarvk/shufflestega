var crypto = require("crypto");

var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js");
var PBKDF2 = require("crypto-js/pbkdf2");
var UTF8 = require("crypto-js/enc-utf8");
var SHA3 = require("crypto-js/sha3");

var Data = require("./Data");

module.exports = (function() {
    function randomWord32() {
        return CryptoJS.lib.WordArray.random( 4 ).words[ 0 ];
    }

    function randomBool() {
        return (randomWord32() & 1) !== 0;
    }

    function chooseInitVectorEntropyWords( nbits ) {
        var minimalAcceptable = 1,
            maxAcceptable = 4,
            blockSizeBits = 128,
            wordSizeBits = 32,
            chosen = Math.floor( (nbits - blockSizeBits) / wordSizeBits );
        
        if( chosen < minimalAcceptable ) {
            throw new Error( "target " + nbits + " is too small" );
        }

        if( chosen > maxAcceptable ) {
            return maxAcceptable;
        }

        return chosen;
    }

    function createForBits( nbits ) {
        var ivW = chooseInitVectorEntropyWords( nbits );

        return create( {bits: nbits,
                        raw: true,
                        initVectorEntropyWords: ivW} );
    }

    function create(props) {
        props = props || {};

        // IV entropy in 32-bit words. AES-128 standard is 4, i.e. 128 bits.
        var initVectorEntropy = props.initVectorEntropyWords || 4,
            nbits = props.bits,
            rawMode = props.raw;
        
        function deriveIV( seed ) {
            // A full 128-bit IV would take up too much of our very tiny
            // message space. We store instead a 32-bit seed, from which
            // we generate a 128-bit IV.

            // This reduces the randomness, but on the other hand decreases
            // the IV overhead for a small message from 50% (16 of 32 bytes)
            // to 20% (4 of 20 bytes). (Crucially, 32 bytes is too large
            // to hide anything inside a standard deck of cards, which is
            // one of our targets.)

            var hash = SHA3( seed );
            
            return { words: hash.words.splice( 0, 4 ),
                     sigBytes: 16 };
        }

        function _isArray( x ) {
            // Checking whether something is an array is inexplicably
            // hard in Javascript, because (typeof arr === "object").
            // This is supposedly a robust method across implementations.
            return Object.prototype.toString.call( x ) === "[object Array]";
        }

        function _preprocessData( data ) {
            if( _isArray( data ) ) {
                // Array of words. Convert it to the CryptoJS representation.
                return {words: data,
                        sigBytes: 4 * data.length};
            }

            return data;
        }

        function encryptSync( data, password ) {
            var datap = _preprocessData( data ),
                key = PBKDF2( password,
                              "",
                              {keySize: 128/32, iterations: 1000} ),
                seed = CryptoJS.lib.WordArray.random( 4 * initVectorEntropy ),
                iv = deriveIV( seed ),
                encrypted = AES.encrypt( datap, key, {iv: iv} );
            return seed.words.concat( encrypted.ciphertext.words );
        }

        function decryptSync( cryptotext, password ) {
            var key = PBKDF2( password,
                              "",
                              {keySize: 128/32, iterations: 1000} ),
                seed = {words: cryptotext.slice( 0, initVectorEntropy ),
                        sigBytes: 4 * initVectorEntropy},
                iv = deriveIV( seed ),
                cryptotextWords = cryptotext.slice( initVectorEntropy ),
                ciphertext = { words: cryptotextWords,
                               sigBytes: 4 * cryptotextWords.length },
                cipherparams = { ciphertext: ciphertext },
                decrypted = AES.decrypt( cipherparams, key, {iv: iv} );

            if( !rawMode ) {
                decrypted = UTF8.stringify( decrypted );
            }
            
            return decrypted;
        }

        function _numberOfBlocks() {
            return Math.floor( (nbits - initVectorEntropy * 32) / 128 );
        }

        function plaintextBits() {
            return _numberOfBlocks() * 128 - 8;
        }

        function cryptotextBits() {
            return _numberOfBlocks() * 128 + initVectorEntropy * 32;
        }

        return {
            encryptSync: encryptSync,
            decryptSync: decryptSync,
            plaintextBits: plaintextBits,
            cryptotextBits: cryptotextBits
        };
    }

    return {
        randomWord32: randomWord32,
        randomBool: randomBool,
        chooseInitVectorEntropyWords: chooseInitVectorEntropyWords,
        create: create,
        encryptor: createForBits,
        decryptor: createForBits
    };
})();
