/* A central initializer and loop for the Beat Blaster game */
function Game (canvas) {
    this.HEIGHT = 600;
    this.WIDTH = 600;
    this.canvas = canvas;
    this.stage;
    this.loader;

    this.initGame(this.canvas);
}

Game.prototype.setUpCanvas = function (canvas) {
    canvas.attr({
        width: this.WIDTH,
        height: this.HEIGHT
    });
}

Game.prototype.loadComplete = function () {
	console.log("Load Complete");
    this.stage = new createjs.Stage(this.canvas[0]);
}
// The initializer function. Expects a canvas element as argument.
Game.prototype.initGame = function(canvas) {
    // Ensure canvas is a jQuery object
    if (!(canvas instanceof jQuery)) {
        canvas = jQuery(canvas);
    }

    this.setUpCanvas(canvas);

    // Load resources
    jQuery.getScript("./beatblaster/js/loader.js", function (data, textStatus, jqxhr) {
    	console.log("Loader: " + textStatus);
    	if (jqxhr.status !== 200) {
    		// Load failed, abort
    		console.log("Couldn't load loader, status: " + textStatus);
    		return;
    	}
    	// Preloader loaded, initialize
    	this.loader = new Loader(this.loadComplete);
    });

}
