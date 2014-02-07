var buster = require("buster");

var Data = require("../src/Data");

buster.testCase( "Data", {
    "word to bits": function() {
        buster.assert.equals( Data.wordToBits( 0x7f010080 ),
                              [ 0, 1, 1, 1, 1, 1, 1, 1,
                                0, 0, 0, 0, 0, 0, 0, 1,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                1, 0, 0, 0, 0, 0, 0, 0 ] );

        buster.assert.equals( Data.wordToBits( -1 ),
                              [ 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1 ] );
    },

    "words to bits": function() {
        buster.assert.equals( Data.wordsToBits( [ 0 ] ),
                              [ 0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0, 0, 0, 0 ] );

        buster.assert.equals( Data.wordsToBits( [ 0x7f010080 ] ),
                              [ 0, 1, 1, 1, 1, 1, 1, 1,
                                0, 0, 0, 0, 0, 0, 0, 1,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                1, 0, 0, 0, 0, 0, 0, 0 ] );

        buster.assert.equals( Data.wordsToBits( [ -1 ] ),
                              [ 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1 ] );

        buster.assert.equals( Data.wordsToBits( [ 0, 0x7f010080 ] ),
                              [ 0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                0, 1, 1, 1, 1, 1, 1, 1,
                                0, 0, 0, 0, 0, 0, 0, 1,
                                0, 0, 0, 0, 0, 0, 0, 0,
                                1, 0, 0, 0, 0, 0, 0, 0 ] );
    },

    "bits to words": function() {
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
    }
} );
