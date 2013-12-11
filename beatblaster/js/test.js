var c;
var stage;
var circles = [];
var handler;

var canv = $( "<canvas>" );
c = canv[ 0 ];

c.width = 600;
c.height = 480;

$( "#canvascontain" ).append( c );

stage = new createjs.Stage( c );

function createCircle( color, radius, xspeed, yspeed ) {
    var circle = new createjs.Shape();
    circle.graphics.beginFill( color ).drawCircle( 0, 0, radius );
    circle.x = 10;
    circle.y = 240;
    circle.speedX = xspeed;
    circle.speedY = yspeed;
    circle.activated = true;
    stage.addChild( circle );
    circles.push( circle );
}

function logicCircles() {
    for ( var i = 0; i < circles.length; i++ ) {
        var e = circles[ i ];
        if ( !e.activated ) continue;
        e.x += e.speedX;
        e.y += e.speedY;
        if ( e.x < -20 || e.x > 620 || e.y < -20 || e.y > 500 ) {
            e.activated = false;
            stage.removeChild( e );
        }
    }
}

function handleTick() {
    handler.tick();
    logicCircles();
    stage.update();
}

function loadsuccess( data ) {
    handler = new SoundHandler( stage, data );
    handler.registerMusic( "sound" );
    handler.startMusic();
    createjs.Ticker.addEventListener( "tick", handleTick );
}

stage.addEventListener( "musicevent", function( event ) {
    if ( event.data == "end" ) return;
    var s = 10;
    if ( event.note == 0 ) {
        createCircle( "black", 20, 2 * s, 0 );
    } else if ( event.note == 1 ) {
        createCircle( "blue", 10, 1.5 * s, 0.2 * s );
        createCircle( "blue", 10, 1.5 * s, -0.2 * s );
    } else if ( event.note == 2 ) {
        createCircle( "green", 10, 1 * s, 0.8 * s );
        createCircle( "green", 10, 1 * s, -0.8 * s );
    } else if ( event.note == 3 ) {
        createCircle( "red", 10, 1.8 * s, 0.1 * s );
        createCircle( "red", 10, 1.8 * s, -0.1 * s );
    } else {
        createCircle( "black", 10, 0.6 * s, 0.6 * s );
        createCircle( "black", 10, 0.6 * s, -0.6 * s );
    }
} );

createjs.Sound.addEventListener( "fileload", createjs.proxy( this.loadHandler, this ) );

createjs.Sound.registerSound( "tracing.mp3", "sound" );

function loadHandler() {
    $.ajax( {
        dataType: "json",
        url: "out.js",
        success: function( data ) {
            loadsuccess( data.timeline );
        },
        fail: function() {
            console.log( "json failure" );
        }
    } );
}