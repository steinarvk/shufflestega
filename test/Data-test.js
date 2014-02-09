var buster = require("buster");

var Data = require("../src/Data");

buster.testCase( "Data", {
    "word to bits": function() {
        buster.assert.equals( Data.wordToBits( 0x7f010080 ),
                              "01111111000000010000000010000000" );

        buster.assert.equals( Data.wordToBits( -1 ),
                              "11111111111111111111111111111111" );
    },

    "bits to word-array": function() {
        buster.assert.equals( Data.bitsToWordArray( "10000000" ),
                              { words: [ 1 << 31 ],
                                sigBytes: 1 } );

        buster.assert.equals(
            Data.bitsToWordArray( "10000000" + "00001111" +
                                  "11110000" + "11111111" +
                                  "00000001" + "11110000" +
                                  "11111111" ),
            { words: [ 0x000ff0ff | (1 << 31), 0x01f0ff00 ],
              sigBytes: 7 } );
    },

    "word-array to bits": function() {
        buster.assert.equals(
            Data.wordArrayToBits( { words: [ 1 << 31 ],
                                    sigBytes: 1 } ),
            "10000000" );

        buster.assert.equals(
            Data.wordArrayToBits(
                { words: [ 0x000ff0ff | (1 << 31), 0x01f0ff00 ],
                  sigBytes: 7 } ),
            "10000000" + "00001111" + "11110000" + "11111111" +
                "00000001" + "11110000" + "11111111" );
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

    "bits to number": function() {
        buster.assert.equals( Data.bitsToNum( "0" ), 0 );
        buster.assert.equals( Data.bitsToNum( "0000" ), 0 );
        buster.assert.equals( Data.bitsToNum( "1" ), 1 );
        buster.assert.equals( Data.bitsToNum( "10" ), 2 );
        buster.assert.equals( Data.bitsToNum( "1111" ), 15 );
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
    },

    "lower order bits": function() {
        buster.assert.equals( Data.lowerOrderBits( "1100101010001101001", 8 ),
                              "01101001" );

        buster.assert.equals( Data.lowerOrderBits( "11101", 8 ),
                              "11101" );
    }
} );
