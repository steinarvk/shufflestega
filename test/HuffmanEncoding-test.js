var buster = require("buster");

var HuffmanEncoding = require("../src/HuffmanEncoding");
var Data = require("../src/Data");
var HuffmanData = require("../generated/HuffmanPG100");

buster.testCase( "HuffmanEncoding", {
    "encoding and decoding": function() {
        var codec = HuffmanEncoding( HuffmanData ),
            text = "HELLO WORLD",
            encoded = codec.encode( text ),
            decoded = codec.decode( encoded ),
            i;

        buster.assert.equals( text, decoded );

        for(i = 0;i < encoded.length; i++) {
            buster.assert.contains( "01", encoded[i] );
        }
        buster.assert.less( encoded.length / 8, text.length );
    },

    "encoding and decoding through generic interface": function() {
        var nbits = 256,
            codec = HuffmanEncoding( HuffmanData ).create( nbits ),
            text = "Hello world",
            encoded = codec.encode( text ),
            encodedU = codec.encode( text.toUpperCase() ),
            encodedL = codec.encode( text.toLowerCase() ),
            decoded = codec.decode( encoded ),
            i;

        buster.assert.equals( Data.wordArrayToBits(encoded).length, nbits );

        buster.assert.equals( encoded, encodedU );
        buster.assert.equals( encoded, encodedL );
        buster.assert.equals( text.toUpperCase(), decoded );

        for(i = 0;i < encoded.length; i++) {
            buster.assert.contains( "01", encoded[i] );
        }
    }
} );
