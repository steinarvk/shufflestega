var Data = require("./Data");

module.exports = function(tree) {
    function encode(s) {
        var i, rv = "";

        for(i = 0;i < s.length; i++) {
            rv += tree.encoder[ s.charCodeAt( i ) ];
        }

        rv += tree.encoder[ null ];

        return rv;
    }

    function decode(s) {
        var i = 0, j, node = tree.decoder, rv = "";

        while( s.length > i ) {
            j = (s[ i ] === '0') ? 0 : 1;

            node = node[j];

            if( node === null ) {
                break;
            } else if( typeof node === "number" ) {
                rv += String.fromCharCode( node );
                node = tree.decoder;
            }

            i += 1;
        }

        return rv;
    }

    function create( nbits ) {
        function wrappedEncode( s ) {
            s = s.toUpperCase();

            var rv = encode( s );

            while( rv.length < nbits ) {
                rv += "0";
            }

            while( (rv.length % 8) >= 1 ) {
                rv += "0";
            }

            return Data.bitsToWordArray( rv );
        }

        function wrappedDecode( s ) {
            var rv = Data.wordArrayToBits( s );

            return decode( rv );
        }

        return {
            encode: wrappedEncode,
            decode: wrappedDecode
        };
    }
    
    return {
        encode: encode,
        decode: decode,
        create: create,
        encoder: create,
        decoder: create
    };
};
