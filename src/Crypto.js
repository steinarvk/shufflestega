var Q = require("q");
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

    function create() {
        var initVectorEntropy = 3; // in 32-bit words

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

        function encryptSync( data, password ) {
            var key = PBKDF2( password,
                              "",
                              {keySize: 128/32, iterations: 1000} ),
                seed = CryptoJS.lib.WordArray.random( 4 * initVectorEntropy ),
                iv = deriveIV( seed ),
                encrypted = AES.encrypt( data, key, {iv: iv} );
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
            
            return UTF8.stringify( decrypted );
        }

        return {
            encryptSync: encryptSync,
            decryptSync: decryptSync
        };
    }

    return {
        randomWord32: randomWord32,
        randomBool: randomBool,
        create: create
    };
})();
