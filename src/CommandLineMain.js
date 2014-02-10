#!/usr/bin/env node

var program = require('commander');

var AESCrypto = require("./AESCrypto");
var PlainCodec = require("./PlainCodec");
var HuffmanEncoding = require("./HuffmanEncoding");
var Stega = require("./Stega");

function loadCodec( name ) {
    if( typeof name !== "string" ) {
        return name;
    }

    if( name === "huffman-shakespeare" ) {
        return HuffmanEncoding( require("../generated/HuffmanPG100") );
    }

    if( name === "plain" ) {
        return PlainCodec;
    }
    
    throw new Error( "no such codec: " + name );
}

function parseSequence( s ) {
    return s.split(",").map( function(x) { return parseInt(x); } );
}

function main(args) {
    var codec = loadCodec( args.codec ),
        stega = Stega.create( codec, AESCrypto ),
        output = "";

    args.password = args.password || "";

    if( args.message ) {
        output = stega.hideSync( args.message, args.password, args.length );

        output = "Encoded: " + output;
    } else if( args.sequence ) {
        output = stega.extractSync( args.sequence, args.password );

        output = "Extracted: " + JSON.stringify( output );
    } else {
        throw new Error( "no operation possible" );
    }

    console.log( output );

    return output;
}

program
    .version( "0.1.0")
    .option( "-m, --message <msg>", "Message to encode" )
    .option( "-p, --password <pw>", "Password" )
    .option( "-s, --sequence <seq>", "Sequence", parseSequence )
    .option( "-n, --length <n>", "Sequence length", parseInt, 52 )
    .option( "-c, --codec <codec>", "Codec", loadCodec, "huffman-shakespeare" )
    .parse( process.argv );

try {
    main( program );
}
catch( err ) {
    console.log( "Error: " + err.message );

    program.help();
    
    process.exit( 1 );
}

