var Stega = require("./Stega"),
    ich = require("icanhaz"),
    $ = require( "jquery" ),
    Bignum = require( "./Bignum" ),
    Ordering = require( "./Ordering" ),
    HuffmanEncoding = require("./HuffmanEncoding"),
    HuffmanShakespeareData = require("../generated/HuffmanPG100"),
    AESCrypto = require("./AESCrypto");

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
        encodebutton = $("#stega_hide")
            .click( onEncodeClicked ),
        encodebutton = $("#stega_extract")
            .click( onDecodeClicked )
        seqtext = $("#stega_sequencetext")
            .keyup( onTextAreaChange )
            .bind( "paste", onTextAreaChange )
            .change( onTextAreaChange ),
        capacity = $("#stega_capacitybar")
                     .progressbar( {value: 35} );

    function getCodec() {
        return HuffmanEncoding( HuffmanShakespeareData );
    }

    function getPassword() {
        return $("#stega_password").val();
    }

    function getMessage() {
        return $("#stega_message").val();
    }
    
    function getStega() {
        return Stega.create( getCodec(), AESCrypto );
    }

    function onEncodeClicked() {
        setOrdering( getStega().hideSync( getMessage(),
                                          getPassword(),
                                          currentN ) );
    }

    function onDecodeClicked() {
        var message = getStega().extractSync( getOrdering(),
                                              getPassword() );
        $("#stega_message").val( message );
    }
    
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

            rv = Ordering.canonicalizeOrdering( rv );

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
        seqtext.val( getOrdering().map( function(x) {
            return x + 1;
        } ).toString() );
    }

    function makePlayingCardLabel( i ) {
        var suit = Math.floor( i / 13 ),
            value = 1 + (i % 13),
            named = { 1: "A",
                      11: "J",
                      12: "Q",
                      13: "K" },
            suits = [ "\u2660", // Spades
                      "\u2665", // Hearts
                      "\u2666", // Diamonds
                      "\u2663" ], // Clubs
            red = suit === 1 || suit === 2,
            vlabel = named[ value ] || ("" + value),
            slabel = suits[ suit ];
            

        return {text: vlabel + slabel,
                classes: (red ? "suit-red" : "suit-black") + " playing-card",
                sublabel: {text: "" + (i + 1)}};
    }

    function makeCardLabel( i ) {
        if( currentN === 52 ) {
            return makePlayingCardLabel( i );
        }
        
        return {text: "" + (i + 1)};
    }

    function makeCard( i ) {
        var rv = $( ich.entry( $.extend( {index: i},
                                         makeCardLabel( i ) ) ) );
        
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

        spinner.val( n );
        
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
