import re
import sys
import ast
import os.path
import codecs

from build import contents

def make_data_uri_from_local( url, basedir ):
    import base64
    path = os.path.join( basedir, url )
    with open( path, "rb" ) as f:
        data = f.read()
    extension = os.path.splitext( path )[ 1 ]
    mimetype = {
        ".png": "image/png",
        ".gif": "image/gif"
    }[ extension ]
    encoded = base64.b64encode( data )
    return u"data:{};base64,{}".format( mimetype, encoded )

def dataurify_css( data, basedir ):
    regex = re.compile( r"url\s*\(([^)]+)*\s*\)" )
    matches = regex.findall( data )
    for filename in matches:
        if filename.startswith("\"") or filename.startswith("'"):
            filename = ast.literal_eval( filename )
        if not filename.startswith( "data:" ):
            datauri = make_data_uri_from_local( filename, basedir )
            data = data.replace( filename, datauri )
    return data

def main( infile, basedir, outfile ):
    css = contents( infile )
    css = dataurify_css( css, basedir )
    with codecs.open( outfile, "w", "utf8" ) as f:
        f.write( css )

if __name__ == '__main__':
    main( *sys.argv[1:] )
