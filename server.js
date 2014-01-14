/**
* Module dependencies
*/
var express       = require( 'express' ),
    http          = require( 'http' ),
    path          = require( 'path' ),
    controller    = {};

var app = express();

// layers
app.set( 'model', path.join( __dirname, 'src/main/model' ) );
app.set( 'views', path.join( __dirname, 'src/main/views' ) );
app.set( 'controller', path.join( __dirname, 'src/main/controller' ) );
app.set( 'services', path.join( __dirname, 'src/main/services' ) );
app.set( 'dao', path.join( __dirname, 'src/main/dao' ) );

// all environments
app.set( 'port', process.env.PORT || 9001 );
app.set( 'views', app.get( 'views' ) );
app.set( 'view engine', 'ejs' );
app.use( express.favicon( path.join( __dirname, '/resources/favicon.png' ) ) );
app.use( express.logger( 'dev' ) );
app.use( express.json() );
app.use( express.urlencoded() );
app.use( express.methodOverride() );
app.use( express.cookieParser( 'your secret here' ) );
app.use( express.session() );
app.use( express.compress() );
app.use( app.router );
app.use( express.static( path.join( __dirname, 'resources' ) ) );

// development only
if( 'development' == app.get( 'env' ) ) {

    app.use( express.errorHandler() );

}

// controllers
controller = require( app.get( 'controller' ) );
controller.init( app );

http.createServer( app ).listen( app.get( 'port' ), function() {
  
  console.log('listening on ' + app.get( 'port' ) );

} );