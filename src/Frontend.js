var Stega = require("./Stega"),
    ich = require("icanhaz"),
    $ = require( "jquery" ),
    Bignum = require( "./Bignum" );

require( "jquery-ui" );

$( document ).on( "ready", function() {
    var app = ich.app( {} ),
        currentN = 52,
        root = $("#shufflestega")
            .html( app ),
        spinner = $("#stega_sequencelength")
            .spinner({
                stop: onSequenceLengthSpinnerChanged
            })
            .change( onSequenceLengthSpinnerChanged ),
        actives = $("#stega_sequence_active")
            .sortable({
                update: function( event, ui ) {
                    ui.item.trigger( "stega-activate" );

                    updateSequenceText();
                }
            })
            .disableSelection(),
        seqtext = $("#stega_sequencetext")
            .keyup( onTextAreaChange )
            .bind( "paste", onTextAreaChange )
            .change( onTextAreaChange ),
        capacity = $("#stega_capacitybar")
                     .progressbar( {value: 35} );
    
    function onSequenceLengthSpinnerChanged() {
        var v = parseInt( spinner.val() );
        setSequenceLength( v );
    }

    function setSequenceLength( n ) {
        if( typeof n !== "number" || (n%1) !== 0 ) {
            return false;
        }

        if( n < 2 || n > 500 ) {
            return false;
        }

        if( n === currentN ) {
            return false;
        }

        resetOrdering( n );

        return true;
    }

    function onTextAreaChange( evt ) {
        function onInvalid() {
            seqtext.addClass( "invalid" );
        }

        function onValid() {
            seqtext.removeClass( "invalid" );
        }

        var rv;

        try {
            rv = seqtext.val().split(",").map( function(x) {
                return parseInt( x );
            } );

            if( rv.length !== currentN ) {
                throw new Error( "ordering not valid" );
            }

            if( !Bignum.validOrdering( rv ) ) {
                throw new Error( "ordering not valid" );
            }

            onValid();

            setOrdering( rv );

            $(".ordered-box").trigger("stega-activate");
        }
        catch(err) {
            onInvalid();
        }
    };

    function getOrdering() {
        return actives.sortable("toArray", {attribute: "data-value"})
            .map( function(x) {
                return parseInt( x );
            } );
    }

    function updateSequenceText() {
        seqtext.val( getOrdering().toString() );
    }

    function makeCard( i ) {
        var rv = $( ich.entry( {index: i,
                                displaynumber: i + 1} ) );
        
        return rv.addClass( "ordered-box-inactive" )
            .bind( "stega-activate", function() {
                rv.removeClass( "ordered-box-inactive" );
                return true;
            } )
            .click( function() {
                rv.trigger("stega-activate")
                    .remove().appendTo( actives );

                updateSequenceText();
            } );
    }

    function resetOrdering( n ) {
        var rv = [], i;
        currentN = n;
        for(i = 0; i < n; i++) {
            rv.push( i );
        }
        return setOrdering( rv );
    }

    function setOrdering( ordering ) {
        var i;

        if( getOrdering() === ordering ) {
            return;
        }

        actives.empty();
        for(i = 0; i < ordering.length; i++) {
            makeCard( ordering[i] ).appendTo( actives );
        }

        updateSequenceText();
    }

    resetOrdering( 52 );
} );
