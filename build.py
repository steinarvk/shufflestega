import pystache
import os.path
import subprocess as sp
import sys
import errno
import codecs
import os
import re

def contents( fn ):
    with codecs.open( fn, "r", "utf8" ) as f:
        return f.read()

def inline_js_block(code):
    return u"""<script type="text/javascript">{}</script>""".format( code )

def inline_css_block(code):
    return u"""<style type="text/css">{}</style>""".format( code )

def inline_ich_block(name, code):
    rv = u"""<script id="{}" type="text/html">{}</script>"""
    return rv.format(name, code)

def inline_ich_blocks_from_dir(ichdir):
    fnre = re.compile( r"(.*)\.html$" )
    rv = []
    for filename in os.listdir( ichdir ):
        m = fnre.match( filename )
        if m:
            name = m.groups()[ 0 ]
            code = contents( os.path.join( ichdir, filename ) )
            rv.append( inline_ich_block( name, code ) )
    return "\n\n".join( rv )

def sibling_filename( base, name ):
    head, tail = os.path.split( base )
    return os.path.join( head, name )

def mkbasedir( path ):
    head, _ = os.path.split( path )
    try:
        os.makedirs( head )
    except OSError as exc:
        if not (exc.errno == errno.EEXIST and os.path.isdir( head )):
            raise

def render_single_file( outname, template, ich, js, css ):
    code = inline_js_block( js )
    if css.strip():
        code += inline_css_block( css )
    code += ich
    args = {
        "mainscript": code
    }
    mkbasedir( outname )
    with codecs.open( outname, "w", "utf8" ) as f:
        f.write( pystache.render( template, args ) )

def browserify_js():
    args = [ "browserify", "." ]
    return sp.check_output( args ).decode( "utf8" )

def minify_js( gcjar, js ):
    args = [ "java", "-jar", gcjar, "--language_in=ECMASCRIPT5" ]
    p = sp.Popen( args, stdin = sp.PIPE, stdout = sp.PIPE )
    output, _ = p.communicate( js.encode("utf8") )
    return output.decode( "utf8" )

def main(gcjar, outname, templatefile, ichdir, cssfile):
    fulljs = browserify_js()
    minjs = None
    ich = inline_ich_blocks_from_dir( ichdir )
    for minify in (True,False):
        confs = [ "single-file" ]
        if minify:
            confs.append( "minified" )
        confname = "-".join( confs )
        sfoutname = outname.replace( "CONFIGURATION", confname )
        if minify and not minjs:
            minjs = minify_js( gcjar, fulljs )
        js = minjs if minify else fulljs
        css = contents( cssfile )
        template = contents( templatefile )
        render_single_file( sfoutname, template, ich, js, css )

if __name__ == '__main__':
    main(*sys.argv[1:])
