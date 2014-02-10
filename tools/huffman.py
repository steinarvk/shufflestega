# encoding: utf-8

import os.path

from collections import defaultdict, Counter
import heapq
import sys
import string
import json

def collect_statistics( s ):
    context = None
    general = Counter()
    specific = defaultdict(Counter)
    for token in s:
        general[ token ] += 1
        if context != None:
            specific[ context ][ token ] += 1
        context = token
    return general, specific

def smooth_counter( counter, allowable ):
    for token in allowable:
        counter[ token ] += 1
    return counter

def build_huffman_tree( counter ):
    heap = []
    for token, count in counter.items():
        heapq.heappush( heap, (count, token) )
    while len( heap ) > 1:
        a, b = (heapq.heappop(heap) for i in range(2))
        count1, token1 = a
        count2, token2 = b
        heapq.heappush( heap, (count1 + count2, (token1, token2)) )
    totalcount, tree = heap[ 0 ]
    return tree

def character_to_token( ch ):
    assert len(ch) == 1
    ch = ch.upper()
    if ch == "\n":
        return "<end>"
#    if ch not in (string.letters + string.digits + " "):
#        return None
    return ch

def encode_static( tree, s ):
    encoder = make_huffman_encoder( tree )
    return "".join( encoder[ch] for ch in s ) + encoder["<end>"]
    
def make_huffman_encoder( tree, prefix = "" ):
    rv = {}
    if type( tree ) == tuple:
        for subtree, walk in zip(tree, "01"):
            rv.update( make_huffman_encoder( subtree, prefix + walk ) )
    else:
        rv[ tree ] = prefix
    return rv

def make_huffman_decoder( tree ):
    encoder = make_huffman_encoder( tree )
    decoder = [(code, token) for token, code in encoder.items()]
    decoder.sort( key = lambda(c, t): len(c), reverse = True )
    return decoder

def encode_context( tree, trees, s ):
    encoder = make_huffman_encoder( tree )
    encoders = {k: make_huffman_encoder(v) for k, v in trees.items()}
    rv = []
    ctx = None
    enc = encoder
    for ch in s:
        rv.append( enc[ ch ] )
        ctx = ch
        try:
            enc = encoders[ ctx ]
        except KeyError:
            enc = encoder
    return "".join( rv ) + enc[ "<end>" ]

def make_json_token( token ):
    special = {
        "<end>": None
    }
    try:
        return special[ token ]
    except KeyError:
        assert len(token) == 1
        return ord( token[ 0 ] )

def make_json_decoder( tree ):
    if type( tree ) == tuple:
        return [ make_json_decoder(x) for x in tree ]
    else:
        return make_json_token( tree )

def make_json_encoder( tree ):
    encoder = make_huffman_encoder( tree )
    encoder = { make_json_token(k): v for k, v in encoder.items() }
    return encoder

def dump_json_tree( tree ):
    return {
        "encoder": make_json_encoder( tree ),
        "decoder": make_json_decoder( tree )
    }

def dump_json_context( tree, trees ):
    rv = dump_json_tree( tree )
    rv.update({k: dump_json_tree(v) for k, v in trees.items()})
    return rv

if __name__ == '__main__':
    filename = sys.argv[1]
    tokens = []
    with open( filename, "rb" ) as f:
        for ch in f.read():
            token = character_to_token( ch )
            if token:
                tokens.append( token )
    general, specific = collect_statistics( tokens )
    smooth = lambda c : smooth_counter( c, map( chr, range(256) ) + ["<end>"] )
    general = smooth( general )
    specific = {k: smooth(v) for k, v in specific.items()}
    tree = build_huffman_tree( general )
    trees = {k: build_huffman_tree(v) for k, v in specific.items()}
    testdata = [ "THERE IS NO SUCH FUNCTION; THE EASIEST WAY TO DO THIS IS TO USE A DICT COMPREHENSION."
               , "VITLAUS MANN VAKER ALL NATTI, TENKJER BÅDE OPP OG UT"
               , "HAN ER TRØYTT OG MOD NÅR MORGONEN KJEM, OG ALT ER FLOKUT SOM FYRR"
               , "NO MATTER HOW YOU SLICE IT IT'S STILL YOUR FACE BE HUMANE USE BURMA SHAVE"
               , "BE SURE TO DRINK YOUR OVALTINE"
               , "HARDLY A DRIVER IS NOW ALIVE WHO PASSED ON HILLS AT 75"
               , "PAST SCHOOLHOUSES TAKE IT SLOW LET THE LITTLE SHAVERS GROW"
               , "IF YOU DISLIKE BIG TRAFFIC FINES SLOW DOWN TILL YOU CAN READ THESE SIGNS"
               , "DON'T TAKE A CURVE AT 60 PER. WE HATE TO LOSE A CUSTOMER"
               , "SHAVE THE MODERN WAY NO BRUSH NO LATHER NO RUB-IN"
               , "TAKES THE H OUT OF SHAVE MAKES IT SAVE SAVES COMPLEXION SAVES TIME AND MONEY"
               , "EVERY SHAVER NOW CAN SNORE SIX MORE MINUTES THAN BEFORE"
               , "YOUR SHAVING BRUSH HAS HAD ITS DAY SO WHY NOT SHAVE THE MODERN WAY"
               , "THE COMPLETE LIST OF THE 600 OR SO KNOWN SETS OF SIGNS IS LISTED IN SUNDAY DRIVES AND IN THE LAST PART OF THE VERSE BY THE SIDE OF THE ROAD"
               , "THE CONTENT OF THE EARLIEST SIGNS IS LOST, BUT IT IS BELIEVED THAT THE FIRST RECORDED SIGNS, FOR 1927 AND SOON AFTER, ARE CLOSE TO THE ORIGINALS"
               , "THE FIRST ONES WERE PROSAIC ADVERTISEMENTS"
               , "GENERALLY THE SIGNS WERE PRINTED WITH ALL CAPITAL LETTERS"
               , "THE STYLE SHOWN BELOW IS FOR READABILITY"
               ]
    effxs = []
    effys = []
    for s in testdata:
        x = encode_static( tree, s )
        y = encode_context( tree, trees, s )
        effx = float(len(x))/len(s)
        effy = float(len(y))/len(s)
        effxs.append( effx )
        effys.append( effy )
#        print s, len(s), len(x), effx 
#        print s, len(s), len(y), effy
    print >> sys.stderr, "Static: ", min(effxs), sum(effxs)/len(effxs), max(effxs)
    print >> sys.stderr, "Context: ", min(effys), sum(effys)/len(effys), max(effys)
    # Unfortunately the required tree for the "context" version works out to about 500 KiB
    # which is too much for our Javascript application.
    print "// Generated from {}".format( os.path.basename( filename ) )
    print "module.exports = {};".format( json.dumps( dump_json_tree( tree ) ) )
