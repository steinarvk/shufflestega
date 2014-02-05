var buster = require("buster");

var Crypto = require("../src/Crypto");

buster.testCase( "Crypto", {
    "decryption succeeds": function() {
        var crypto = Crypto.create(),
            plaintext = "Hello world",
            password = "password",
            ciphertext = crypto.encryptSync( plaintext, password );

        buster.assert.equals( crypto.decryptSync( ciphertext, password ),
                              plaintext );
    },

    "decryption fails": function() {
        var crypto = Crypto.create(),
            plaintext = "Hello world",
            password = "password",
            ciphertext = crypto.encryptSync( plaintext, password + "x" );
        
        buster.refute.equals( crypto.decryptSync( ciphertext, password ),
                              plaintext );
    },

    "minimum cryptotext length": function() {
        var crypto = Crypto.create(),
            plaintext = "",
            password = "password",
            ciphertext = crypto.encryptSync( plaintext, password );
        
        // 32-bit IV seed + 128-bit block = 20 bytes
        buster.assert.equals( ciphertext.length, 5 );

        buster.assert.equals( crypto.decryptSync( ciphertext, password ),
                              plaintext );
    },

    "longest plaintext within one block": function() {
        var crypto = Crypto.create(),
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


            // 32-bit IV seed + 128-bit block = 20 bytes
            buster.assert.equals( ciphertext.length, 5 );

            buster.assert.equals( crypto.decryptSync( ciphertext, password ),
                                  plaintext );
        }
    },

    "shortest plaintext spanning two blocks": function() {
        var crypto = Crypto.create(),
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

            // 32-bit IV seed + 2 x 128-bit block = 36 bytes
            buster.assert.equals( ciphertext.length, 9 );

            buster.assert.equals( crypto.decryptSync( ciphertext, password ),
                                  plaintext );
        }
    }

} );
