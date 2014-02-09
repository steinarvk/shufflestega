var Stega = require("./Stega"),
    ich = require("icanhaz"),
    $ = require( "jquery" );

require( "jquery-ui" );

$( document ).on( "ready", function() {
    var i = 0, root = $("#shufflestega");

    root.html( "" );
    root.sortable();
    root.disableSelection();

    for(i = 0; i < 52; i++) {
        $( ich.entry( {number: i + 1} ) )
            .appendTo( root );
    }
} );
