var Data = require("./Data");

module.exports = (function() {
    function create( nbits ) {
        function encode( s ) {
            var rv = "", i;

            for(i = 0; i < s.length; i++) {
                rv += Data.byteToBits( s.charCodeAt( i ) );
            }

            while( rv.length < nbits ) {
                rv += "0";
            }

            rv = Data.bitsToWordArray( rv );
            
            return rv;
        }

        function decode( wordarray ) {
            var bits = Data.wordArrayToBits( wordarray ),
                rv = [],
                x;

            while( bits.length > 0 ) {
                x = bits.slice( 0, 8 );
                x = Data.bitsToNum( x );
                x = String.fromCharCode( x );
                rv.push( x );

                bits = bits.slice( 8 );
            }

            return rv.join( "" );
        }

        return {
            encode: encode,
            decode: decode
        };
    }
    
    return {
        create: create,
        encoder: create,
        decoder: create
    };
})();
