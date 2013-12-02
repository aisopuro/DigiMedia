/* A central initializer and loop for the Beat Blaster game */
var HEIGHT = 600;
var WIDTH = 600;
var canvas;

function setUpCanvas (canvas) {
    canvas.attr({
        width: WIDTH,
        height: HEIGHT
    });
}

function loadComplete () {
	console.log("Load Complete");
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

    // Load resources
    jQuery.getScript("./beatblaster/js/loader.js", function (data, textStatus, jqxhr) {
    	console.log("Loader: " + textStatus);
    	if (jqxhr.status !== 200) {
    		// Load failed, abort
    		console.log("Couldn't load loader, status: " + textStatus);
    		return;
    	}
    	// Preloader loaded, initialize
    	new Loader(loadComplete);
    });

}