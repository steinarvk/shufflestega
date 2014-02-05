"use strict";

/* The simplest representation of binary strings in Javascript is
   ASCII: "0111011001". This is of course not memory efficient, but
   that's not likely to be a problem as we're only dealing with
   fairly short strings (less than a kilobyte).

   It has the benefit that it's easy to print and inspect for
   debugging purposes. It's also shorter to type than e.g. [1,0,0,1,0].
*/

module.exports = (function() {
    function digitValue( digit ) {
        if( digit === "0" || digit === 0 ) {
            return 0;
        } else if( digit === "1" || digit === 1) {
            return 1;
        } else {
            throw new Error( "not a binary digit: '" + digit + "'" );
        }
    }

    function digitString( value ) {
        return (value === 0) ? "0" : "1";
    }

    function fromByte( n ) {
        var rv = "", i;

        if( typeof n !== "number" ) {
            throw new Error( "not a numeric byte (not a number): " + n );
        }

        if( n < 0 || n > 255 ) {
            throw new Error( "not a numeric byte (out of range): " + n );
        }

        if( (n % 1) !== 0 ) {
            throw new Error( "not a numeric byte (not an integer): " + n );
        }

        for(i = 0; i < 8; i++) {
            rv += digitString( n & (1 << (7-i)) );
        }
        
        return rv;
    }

    function toByte( digits ) {
        var rv = 0, i;

        if( digits.length !== 8 ) {
            throw new Error( "binary byte of wrong length: " + digits.length );
        }

        for(i = 0; i < 8; i++) {
            rv |= digitValue( digits[i] ) << (7 - i);
        }
        
        return rv;
    }

    function fromAscii( s ) {
        var rv = [], i;
        
        for(i = 0; i < s.length; i++) {
            rv.push( fromByte( s.charCodeAt(i) ) );
        }

        return rv.join("");
    }

    function toAscii( digits ) {
        var rv = [];

        while( digits.length > 0 ) {
            rv.push( String.fromCharCode( toByte( digits.slice(0, 8) ) ) );
            digits = digits.slice( 8 );
        }

        return rv.join("");
    }

    return {
        fromByte: fromByte,
        toByte: toByte,
        fromAscii: fromAscii,
        toAscii: toAscii
    };
})();
