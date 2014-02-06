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
    }
} );
