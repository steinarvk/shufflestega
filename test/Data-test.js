var buster = require("buster");

var Data = require("../src/Data");

buster.testCase( "Data", {
    "word to bits": function() {
        buster.assert.equals( Data.wordToBits( 0x7f010080 ),
                              "01111111000000010000000010000000" );

        buster.assert.equals( Data.wordToBits( -1 ),
                              "11111111111111111111111111111111" );
    },

    "words to bits": function() {
        buster.assert.equals( Data.wordsToBits( [ 0 ] ),
                              "00000000000000000000000000000000" );

        buster.assert.equals( Data.wordsToBits( [ 0x7f010080 ] ),
                              "01111111000000010000000010000000" );

        buster.assert.equals( Data.wordsToBits( [ -1 ] ),
                              "11111111111111111111111111111111" );

        buster.assert.equals( Data.wordsToBits( [ 0, 0x7f010080 ] ),
                              "00000000000000000000000000000000" +
                              "01111111000000010000000010000000" );
    },

    "bits (array) to words": function() {
        buster.assert.equals(
            Data.bitsToWords( [ 0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0, 0, 0, 0 ] ),
            [ 0 ]
        );
                              

        buster.assert.equals(
            Data.bitsToWords( [ 0, 1, 1, 1, 1, 1, 1, 1,
                                0, 0, 0, 0, 0, 0, 0, 1,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                1, 0, 0, 0, 0, 0, 0, 0 ] ),
            [ 0x7f010080 ]
        );
        
        buster.assert.equals(
            Data.bitsToWords( [ 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1 ] ),
            [ -1 ]
        );

        buster.assert.equals( 
            Data.bitsToWords( [ 0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                0, 1, 1, 1, 1, 1, 1, 1,
                                0, 0, 0, 0, 0, 0, 0, 1,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                1, 0, 0, 0, 0, 0, 0, 0 ] ),
            [ 0, 0x7f010080 ]
        );
    },

    "bits to words": function() {
        buster.assert.equals(
            Data.bitsToWords( "00000000" +
                              "00000000" +
                              "00000000" +
                              "00000000" ),
            [ 0 ]
        );
                              

        buster.assert.equals(
            Data.bitsToWords( "01111111" +
                              "00000001" +
                              "00000000" +
                              "10000000" ),
            [ 0x7f010080 ]
        );
        
        buster.assert.equals(
            Data.bitsToWords( "11111111" +
                              "11111111" +
                              "11111111" +
                              "11111111" ),
            [ -1 ]
        );

        buster.assert.equals( 
            Data.bitsToWords( "01111111" +
                              "00000001" +
                              "00000000" +
                              "10000000" +
                              "11111111" +
                              "11111111" +
                              "11111111" +
                              "11111111" ),
            [ 0x7f010080, -1 ]
        );
    }
} );
