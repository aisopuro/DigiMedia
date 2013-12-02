// Class for handling file loading
function Loader(callback) {
	console.log("init loader");
    this.callback = callback;
	this.callbackName = "callbackName";
    this.queue;
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
    this.callback();
};

Loader.prototype.fileLoaded = function(event) {
    var item = event.item;
	console.log("File loaded. Type: " + item.type);
};

Loader.prototype.loadError = function(event) {
    console.log(event);
};

Loader.prototype.buildQueue = function() {
    // Set to true when running on server
   	this.queue = new createjs.LoadQueue(false);

   	// Add event listeners
   	this.queue.addEventListener("fileload", this.fileLoaded.bind(this));
    this.queue.addEventListener("error", this.loadError.bind(this));
    this.queue.addEventListener("complete", this.done.bind(this));

    // Build queue from manifest functions
    this.queue.loadManifest(this.buildManifest());
    console.log("Queue built");
};

// Returns a list containing the manifest of items to be loaded
Loader.prototype.buildManifest = function() {
    var manifest = [];
    manifest = manifest.join(this.getLoadableScripts());

    return manifest;
};

// Returns a list of paths to the scripts to be loaded
Loader.prototype.getLoadableScripts = function() {
    return [
        {
            id : "easeljs",
            src : "./beatblaster/js/easeljs-0.7.0.min.js",
            type : createjs.LoadQueue.JAVASCRIPT
        }, {
            id : "soundjs",
            src : "./beatblaster/js/soundjs-0.5.0.min.js",
            type : createjs.LoadQueue.JAVASCRIPT
        }
    ];
};
