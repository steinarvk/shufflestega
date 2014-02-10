Concept
=======

shufflestega is an application that fairly securely embeds a short message
in the _order_ of something -- for instance, in the order of a shuffled
deck of cards.

It's mostly intended as a proof of concept and as a demonstration of the
concept of steganography.

The ordering should be indistinguishable from a random ordering, except by
knowing the shared secret and trying to extract and decrypt it.

Process
=======

The message is first encoded into a compact representation, possibly
undergoing some transformations such as case normalization. The default
encoding scheme is Huffman encoding with a static tree tuned for uppercased
English text.

The message is first zero-padded to the maximum-length message it is possible
to encode given the target sequence length. If it's possible to store 16 bytes
of information, "Hello world" is thus indistinguishable from
"Hello world\0\0\0\0\0" (although some encodings, such as the included
Huffman encoding for English text, include encoding-level information that
allow us to reconstruct the original message exactly). This step ensures makes
the length of the message predictable from the length of the sequence, which
enables us to discard the right amount of post-encryption random padding
(see below) when extracting.

The message is then encrypted using AES-128, deriving a key from a password
(the empty string if none was provided) using PBKDF2 and generating a random
IV. This step is important to ensure that the data that is put into the
ordering "appears random", even if the communicating parties don't want to
use a password.

Since the initialization vector is random, encrypting the same message twice
will (with overwhelming probability) give different results. This is important
to preserve secrecy if the same message is ever sent twice.

For short sequences, somewhat less entropy than recommended is used for the
initialization vector than AES-128 recommends -- for a 52-card deck, 96
bits instead of 128. This is necessary to ensure that at least one 16-byte
AES128 block can be encoded. For sequences where it's possible to store 256
bits of information (which means sequences of 58 elements or longer), the
scheme uses a full 128-bit initialization vector.

At this point, if the message is still shorter than the amount of bits the
target sequence could hold, it is padded with random data to ensure that
all possible shufflings of the sequence are possible outputs of the algorithm.

Finally, the generated number (between 0 and n!-1) is mapped to one of the n!
possible orderings of n elements.

Status
======

[![Build Status](https://travis-ci.org/steinarvk/shufflestega.png?branch=master)](https://travis-ci.org/steinarvk/shufflestega)
[![Coverage Status](https://coveralls.io/repos/steinarvk/shufflestega/badge.png?branch=master)](https://coveralls.io/r/steinarvk/shufflestega?branch=master)

The project is currently only usable on the command line.

    $ ./src/CommandLineMain.js --message "attack at dawn" --codec plain
    Encoded: 6,30,15,49,8,12,34,39,5,24,17,19,46,4,40,11,22,48,26,38,32,21,
             14,25,18,35,2,51,10,31,45,33,43,41,50,23,27,42,9,28,47,20,3,7,
             16,44,1,36,13,37,0,29
    $ ./src/CommandLineMain.js --codec plain --sequence "6,30,15,49,8,12,"\
        "34,39,5,24,17,19,46,4,40,11,22,48,26,38,32,21,14,25,18,35,2,51,"\
        "10,31,45,33,43,41,50,23,27,42,9,28,47,20,3,7,16,44,1,36,13,37,0,29"
    Extracted: "attack at dawn\u0000"

License
=======

The project is distributed under the MIT license. See the LICENSE file.
