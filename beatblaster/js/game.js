/* A central initializer and loop for the Beat Blaster game */
var HEIGHT = 600;
var WIDTH = 360;
var canvas;

function setUpCanvas (canvas) {
    canvas.attr({
        width: WIDTH,
        height: HEIGHT
    });
}
// The initializer function. Expects a canvas element as argument.
function initGame (canvas) {
    // Ensure canvas and parent are jQuery objects
    if (!(canvas instanceof jQuery)) {
        canvas = jQuery(canvas);
    }
    if (!(parent instanceof jQuery)) {
    	parent = jQuery(parent);
    }

    setUpCanvas(canvas);
}