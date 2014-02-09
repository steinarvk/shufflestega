var Stega = require("./Stega"),
    ich = require("icanhaz"),
    $ = require( "jquery" );

$( document ).on( "ready", function() {
    var i = 0, root = $("#shufflestega");

    root.html( "" );

    for(i = 0; i < 52; i++) {
        root.append( ich.entry( {number: i + 1} ) );
    }
} );
