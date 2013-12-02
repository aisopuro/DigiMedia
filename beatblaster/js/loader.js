// Class for handling file loading
function Loader (completionCallback) {
	console.log("init loader");
	this.complete = completionCallback;
	var loader = this;
	// Load resources
    jQuery.getScript("./beatblaster/js/preloadjs-0.4.0.min.js", function (data, textStatus, jqxhr) {
    	console.log("Preloader: " + textStatus);
    	if (jqxhr.status !== 200) {
    		// Load failed, abort
    		console.log("Couldn't load preload, status: " + textStatus);
    		return;
    	}
    	else {
    		// Preloader loaded, start loading
    		loader.buildQueue();
    	}
    });
}

Loader.prototype.done = function(event) {
    console.log("Finished loading, exit Loader");
    //this.complete();
};

Loader.prototype.fileLoaded = function(event) {
    var item = event.item;
	console.log("File loaded. Type: " + item.type);
};

Loader.prototype.buildQueue = function() {
   	var queue = new createjs.LoadQueue(true);

   	// Add event listeners
   	queue.addEventListener("fileload", this.fileLoaded);
    queue.addEventListener("complete", this.done);
    console.log("Queue built");
    this.done();
};
