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

The message is first zero-padded to the maximum-length message it is possible
to encode given the target sequence length. If it's possible to store 16 bytes
of information, "Hello world" is thus indistinguishable from
"Hello world\0\0\0\0\0".

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

At this point, if the payload is still shorter than the amount of bits the
target sequence could hold, it is padded with random data to ensure that
all possible shufflings of the sequence are possible outputs of the algorithm.

Technology
==========

shufflestega is a simple client-side Javascript application that fairly
securely embeds a short message in the _order_ of something. For instance,
the ordering of a deck of cards carries about 225 bits of information.

Status
======

The project is still in development and is not usable yet.

Dependencies
============

These are npm package names.

* crypto-js

* q

* biginteger

* buster (for testing)

* browserify (for browser deployment)


