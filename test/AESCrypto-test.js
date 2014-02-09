var buster = require("buster");

var AESCrypto = require("../src/AESCrypto");

buster.testCase( "AESCrypto", {
    "decryption succeeds": function() {
        var crypto = AESCrypto.create({initVectorEntropyWords: 3}),
            plaintext = "Hello world",
            password = "password",
            ciphertext = crypto.encryptSync( plaintext, password );

        buster.assert.equals( crypto.decryptSync( ciphertext, password ),
                              plaintext );
    },

    "IV entropy calculation": function() {
        buster.assert.equals( AESCrypto.chooseInitVectorEntropyWords( 225 ),
                              3 );
        buster.assert.equals( AESCrypto.chooseInitVectorEntropyWords( 255 ),
                              3 );
        buster.assert.equals( AESCrypto.chooseInitVectorEntropyWords( 256 ),
                              4 );
        buster.assert.equals( AESCrypto.chooseInitVectorEntropyWords( 2560 ),
                              4 );

        buster.assert.exception( function() {
            AESCrypto.chooseInitVectorEntropyWords( 127 );
        } );
    },

    "decryption fails": function() {
        var crypto = AESCrypto.create({initVectorEntropyWords: 3}),
            plaintext = "Hello world",
            password = "password",
            ciphertext = crypto.encryptSync( plaintext, password + "x" );
        
        buster.refute.equals( crypto.decryptSync( ciphertext, password ),
                              plaintext );
    },

    "minimum cryptotext length": function() {
        var crypto = AESCrypto.create({initVectorEntropyWords: 3}),
            plaintext = "",
            password = "password",
            ciphertext = crypto.encryptSync( plaintext, password );
        
        // 96-bit IV seed + 128-bit block = 224 bits
        buster.assert.equals( ciphertext.length, 7 );

        buster.assert.equals( crypto.decryptSync( ciphertext, password ),
                              plaintext );
    },

    "longest plaintext within one block": function() {
        var crypto = AESCrypto.create({initVectorEntropyWords: 3}),
            plaintexts = [ "012345678901234",
                           "abcdefghiljklmn",
                           "attack at dawn!",
                           "hello world    " ],
            password = "password",
            plaintext,
            ciphertext,
            i;

        for(i = 0; i < plaintexts.length; i++) {
            plaintext = plaintexts[i];
            ciphertext = crypto.encryptSync( plaintext, password );


            // 96-bit IV seed + 128-bit block = 224 bits
            buster.assert.equals( ciphertext.length, 7 );

            buster.assert.equals( crypto.decryptSync( ciphertext, password ),
                                  plaintext );
        }
    },

    "longest plaintext within one block with full IV entropy": function() {
        var crypto = AESCrypto.create(),
            plaintexts = [ "012345678901234",
                           "abcdefghiljklmn",
                           "attack at dawn!",
                           "hello world    " ],
            password = "password",
            plaintext,
            ciphertext,
            i;

        for(i = 0; i < plaintexts.length; i++) {
            plaintext = plaintexts[i];
            ciphertext = crypto.encryptSync( plaintext, password );


            // 128-bit IV seed + 128-bit block = 224 bits
            buster.assert.equals( ciphertext.length, 8 );

            buster.assert.equals( crypto.decryptSync( ciphertext, password ),
                                  plaintext );
        }
    },

    "shortest plaintext spanning two blocks": function() {
        var crypto = AESCrypto.create({initVectorEntropyWords: 3}),
            plaintexts = [ "012345678901234x",
                           "abcdefghiljklmnx",
                           "attack at dawn!x",
                           "hello world    x" ],
            password = "password",
            plaintext,
            ciphertext,
            i;

        for(i = 0; i < plaintexts.length; i++) {
            plaintext = plaintexts[i];
            ciphertext = crypto.encryptSync( plaintext, password );

            // 96-bit IV seed + 2 x 128-bit block = 352 bits
            buster.assert.equals( ciphertext.length, 11 );

            buster.assert.equals( crypto.decryptSync( ciphertext, password ),
                                  plaintext );
        }
    }

} );
