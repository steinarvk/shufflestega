var buster = require("buster");

var Ordering = require("../src/Ordering");

buster.testCase( "Ordering", {
    "to/from ordering": function() {
        var payload = "11001110001001101110011010111010001011100101101",
            n = 20,
            encoded = Ordering.bitsToOrdering( payload, n ),
            decoded = Ordering.orderingToBits( encoded, payload.length );

        buster.assert.equals( decoded, payload );
        buster.assert.equals( encoded.length, n );
    },

    "ordering to bits returns exact number of bits": function() {
        buster.assert.equals( Ordering.orderingToBits( [0, 1, 2, 3, 4, 5],
                                                       3 ).length,
                              3 );
        buster.assert.equals( Ordering.orderingToBits( [5, 4, 3, 2, 1, 0],
                                                       3 ).length,
                              3 );
        buster.assert.equals( Ordering.orderingToBits( [0, 1, 2, 3, 4, 5],
                                                       300 ).length,
                              300 );
        buster.assert.equals( Ordering.orderingToBits( [5, 4, 3, 2, 1, 0],
                                                       300 ).length,
                              300 );
    },

    "random padding works": function() {
        var payload = "11001110001001101110011010111010001011100101101",
            n = 20,
            encoded = Ordering.bitsToOrdering( payload, n ),
            encoded2 = Ordering.bitsToOrdering( payload, n ),
            decoded = Ordering.orderingToBits( encoded, payload.length ),
            decoded2 = Ordering.orderingToBits( encoded2, payload.length );
            

        buster.assert.equals( decoded, payload );
        buster.assert.equals( encoded.length, n );
        buster.assert.equals( decoded2, payload );
        buster.assert.equals( encoded2.length, n );

        // There's so much "room" in 20! compared to this payload that it
        // should be vanishingly unlikely that the same padding is chosen.

        buster.refute.equals( encoded, encoded2 );
    },

    "random padding hits all sequences": function() {
        var payload = "",
            n = 5, // 5! = 120, ~6.90 bits
            tries = 2000,
            encodings = [],
            i, encoding;

        for(i = 0; i < tries; i++) {
            encoding = Ordering.bitsToOrdering( payload, n ).toString();

            if( encodings.indexOf( encoding ) === -1 ) {
                encodings.push( encoding );
            }
        }

        buster.assert.equals( encodings.length, 120 );
    }
} );
