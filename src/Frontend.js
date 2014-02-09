var Stega = require("./Stega"),
    ich = require("icanhaz"),
    $ = require( "jquery" );

require( "jquery-ui" );

$( document ).on( "ready", function() {
    var i = 0,
        app = ich.app( {} ),
        root = $("#shufflestega")
            .html( app ),
        spinner = $("#stega_sequencelength")
            .spinner(),
        actives = $("#stega_sequence_active")
            .sortable()
            .disableSelection(),
        inactives = $("#stega_sequence_inactive"),
        capacity = $("#stega_capacitybar")
                     .progressbar( {value: 35} );

    for(i = 0; i < 52; i++) {
        $( ich.entry( {number: i + 1} ) )
            .toggleClass( "ordered-box-inactive", i%3 !== 0 )
            .appendTo( (i%3 === 0) ? inactives : actives );
    }
} );
