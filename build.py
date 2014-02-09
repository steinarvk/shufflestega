import pystache
import os.path
import subprocess as sp
import sys
import errno

def contents( fn ):
    with open( fn ) as f:
        return f.read()

def inline_js_block(code):
    return """<script type="text/javascript">{}</script>""".format( code )

def inline_css_block(code):
    return """<style type="text/css">{}</style>""".format( code )

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

def render_single_file( outname, template, js, css ):
    code = inline_js_block( js )
    if css.strip():
        code += inline_css_block( css )
    args = {
        "mainscript": code
    }
    mkbasedir( outname )
    with open( outname, "w" ) as f:
        f.write( pystache.render( template, args ) )

def browserify_js():
    args = [ "browserify", "." ]
    return sp.check_output( args ) 

def minify_js( gcjar, js ):
    args = [ "java", "-jar", gcjar, "--language_in=ECMASCRIPT5" ]
    p = sp.Popen( args, stdin = sp.PIPE, stdout = sp.PIPE )
    output, _ = p.communicate( js )
    return output

def main(gcjar, outname, templatefile, cssfile):
    fulljs = browserify_js()
    minjs = None
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
        render_single_file( sfoutname, template, js, css )

if __name__ == '__main__':
    main(*sys.argv[1:])
