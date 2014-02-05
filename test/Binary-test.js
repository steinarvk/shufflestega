var buster = require("buster");

var Binary = require("../src/Binary");

buster.testCase( "Binary", {
    "by bytes": function() {
        var testdata = [ "10011011",
                         "00111000",
                         "00000000",
                         "11111111",
                         "10101111" ],
            n, x, i;

        for(i = 0; i < testdata.length; i++) {
            x = testdata[ i ];
            n = parseInt( x, 2 );
                
            buster.assert.equals( Binary.toByte(x), n );
            buster.assert.equals( Binary.fromByte(n), x );
        }
    },
   
    "by ascii": function() {
        var text = "Hello world";
        var binary = "01001000011001010110110001101100" +
                     "01101111001000000111011101101111" +
                     "011100100110110001100100";

        buster.assert.equals( Binary.toAscii( binary ), text );
        buster.assert.equals( Binary.fromAscii( text ), binary );
    }
} );
