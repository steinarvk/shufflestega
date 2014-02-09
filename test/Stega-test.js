var buster = require("buster");

var Crypto = require("../src/Crypto");
var PlainCodec = require("../src/PlainCodec");
var Stega = require("../src/Stega");

buster.testCase( "Stega", {
    "hide and extract": function() {
        var message = "attack at dawn",
            password = "colorless green ideas sleep furiously",
            n = 52,
            stega = Stega.create( PlainCodec, Crypto ),
            ordering = stega.hideSync( message, password, n ),
            retrieved = stega.extractSync( ordering, password ),
            i;

        buster.assert.equals( ordering.length, n );
        buster.assert.equals( retrieved.search( message ), 0 );
        
        for(i = 0; i < n; i++) {
            buster.refute.equals( ordering.indexOf( i ), -1 );
        }
    }
} );
