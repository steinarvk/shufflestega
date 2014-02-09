var buster = require("buster");

var PlainCodec = require("../src/PlainCodec");

buster.testCase( "PlainCodec", {
    "encoding and decoding": function() {
        var message = "attack at dawn",
            codec = PlainCodec.create( 128 ),
            encoded = codec.encode( message ),
            encoded2 = codec.encode( message ),
            decoded = codec.decode( encoded );

        buster.assert.equals( decoded.search( message ), 0 );

        buster.assert.equals( encoded.words.length, 4 );
        buster.assert.equals( encoded.sigBytes, 16 );
        buster.assert.equals( encoded, encoded2 );
    }
} );
