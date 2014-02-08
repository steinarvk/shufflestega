var buster = require("buster");

var Bignum = require("../src/Bignum");

buster.testCase( "Bignum", {
    "factorials": function() {
        buster.assert.equals( Bignum.factorial( 0 ), "1" );
        buster.assert.equals( Bignum.factorial( 5 ), "120" );
        buster.assert.equals( Bignum.factorial( 20 ),
                              "2432902008176640000" );
        buster.assert.equals( Bignum.factorial( 52 ),
                              "8065817517094387857166063685640376697528950" +
                              "5440883277824000000000000" );
        buster.assert.equals( Bignum.factorial( 256 ),
                              "8578177753428426541190822716812326251577815" +
                              "2027948561985965565037726945255314758937744" +
                              "0291360451408450375885342336584306157196834" +
                              "6936964753222892884974260256796373325633687" +
                              "8644267520762679456018796886797152114330770" +
                              "2077526646451464709187326100832876325702818" +
                              "9807736717814541702505230186084953190681382" +
                              "5748107025281755945947698703466571273813928" +
                              "6205234756808218860701203611083152093501947" +
                              "4371091017269682628616062636624350228409441" +
                              "9140842461593600000000000000000000000000000" +
                              "0000000000000000000000000000000000" );
    },

    "sequence bits": function() {
        buster.assert.equals( Bignum.sequenceBits( 2 ), 1 );
        buster.assert.equals( Bignum.sequenceBits( 8 ), 15 );
        buster.assert.equals( Bignum.sequenceBits( 52 ), 225 );
        buster.assert.equals( Bignum.sequenceBits( 256 ), 1683 );
    },

    "validating orderings": function() {
        var xs = [ 5, 4, 3, 2, 1, 0 ];

        buster.assert( Bignum.validOrdering( [ 0, 1, 2, 3, 4, 5 ] ) );
        buster.assert( Bignum.validOrdering( [ 4, 2, 1, 5, 3, 0 ] ) );
        buster.refute( Bignum.validOrdering( [ 5, 2, 1, 3, 0 ] ) );
        buster.refute( Bignum.validOrdering( [ 5, 2, 3, 1, 4, 3, 0 ] ) );
        buster.assert( Bignum.validOrdering( [ ] ) );
        buster.refute( Bignum.validOrdering( [ 1, 2 ] ) );

        buster.assert( Bignum.validOrdering( xs ) );
        buster.assert.equals( xs, [ 5, 4, 3, 2, 1, 0 ] );
    },

    "ordering to bignum": function() {
        buster.assert.equals( Bignum.fromOrdering( [ 3, 2, 1, 0 ] ),
                              "23" );
    },

    "bignum to ordering": function() {
        buster.assert.equals( Bignum.toOrdering( "23", 4 ),
                              [ 3, 2, 1, 0 ] );
    },

    "to/from ordering": function() {
        var testdata = [ [ 0, 1, 2, 3 ],
                         [ 3, 2, 1, 0 ],
                         [ 0, 3, 2, 1 ],
                         [ 1, 0, 3, 2 ],
                         [ 1, 2, 3, 4, 0 ],
                         [ 0, 1, 3, 4, 2 ] ],
            original,
            encoding,
            recovered,
            i;

        for(i = 0; i < testdata.length; i++) {
            original = testdata[ i ];
            encoding = Bignum.fromOrdering( original );
            recovered = Bignum.toOrdering( encoding, original.length );
            
            buster.assert.equals( original, recovered );
        }
    },

    "from/to ordering": function() {
        var testdata = [ "12345",
                         "38249",
                         "51234",
                         "3950" ],
            size = 10,
            original,
            ordering,
            recovered,
            i;

        for(i = 0; i < testdata.length; i++) {
            original = testdata[ i ];
            ordering = Bignum.toOrdering( original, size );
            recovered = Bignum.fromOrdering( ordering );
           
            buster.assert.equals( original, recovered );
        }
    },

    "from bits": function() {
        buster.assert.equals( Bignum.fromBits( "10010111" ),
                              "151" );
    },

    "to bits": function() {
        buster.assert.equals( Bignum.toBits("21384329843"),
                              "10011111010100110101111101001110011" );
    },

    "sequencePaddings": function() {
        function findAll( x, payloadbits, seqlen ) {
            var rv = [], i, v;
            
            function randbool() {
                return Math.random() < 0.5;
            }

            for(i = 0; i < 100; i++) {
                v = Bignum.addRandomSequencePadding( x,
                                                     payloadbits,
                                                     seqlen,
                                                     randbool );
                if( rv.indexOf( v ) === -1 ) {
                    rv.push( v );
                }
            }

            rv.sort();

            return rv;
        }
        buster.assert.equals( findAll( "0", 2, 3 ),
                              [ "0", "4" ] );

        buster.assert.equals( findAll( "1", 2, 3 ),
                              [ "1", "5" ] );

        buster.assert.equals( findAll( "2", 2, 3 ),
                              [ "2" ] );

        buster.assert.equals( findAll( "3", 2, 3 ),
                              [ "3" ] );

        buster.assert.equals( findAll( "0", 1, 3 ),
                              [ "0", "2", "4" ] );

        buster.assert.equals( findAll( "1", 1, 3 ),
                              [ "1", "3", "5" ] );
    }
} );
