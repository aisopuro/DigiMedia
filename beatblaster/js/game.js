/* A central initializer and loop for the Beat Blaster game */
function Game (canvas, id) {
    console.log(canvas);
    this.HEIGHT = 600;
    this.WIDTH = 600;
    this.canvas = canvas;
    this.id = id;
    console.log(this.canvas);
    this.stage;
    this.loader;

    this.initGame(this.canvas);
}

Game.prototype.setUpCanvas = function (canvas) {
    canvas.attr({
        id: this.id,
        width: this.WIDTH,
        height: this.HEIGHT
    });
}

Game.prototype.loadComplete = function () {
	console.log("Load Complete");
    console.log(this.canvas[0]);
    console.log(this.id);
    this.stage = new createjs.Stage(this.canvas[0]);
}
// The initializer function. Expects a canvas element as argument.
Game.prototype.initGame = function(canvas) {
    // Ensure canvas is a jQuery object
    if (!(canvas instanceof jQuery)) {
        canvas = jQuery(canvas);
    }
    console.log(canvas);
    this.setUpCanvas(canvas);
    console.log(canvas);

    // Load resources
    var game = this;
    jQuery.getScript("./beatblaster/js/loader.js", function (data, textStatus, jqxhr) {
    	console.log("Loader: " + textStatus);
    	if (jqxhr.status !== 200) {
    		// Load failed, abort
    		console.log("Couldn't load loader, status: " + textStatus);
    		return;
    	}
    	// Preloader loaded, initialize
    	this.loader = new Loader(game.loadComplete.bind(game));
    });

}
