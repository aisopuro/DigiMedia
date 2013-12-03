// Class for handling file loading
function Loader( callback ) {
    console.log( "init loader" );
    this.callback = callback;
    this.callbackName = "callbackName";
    this.queue;
    this.useXHR = ( window.ON_SERVER ) ? true : false;
    var loader = this;
    // Load resources
    jQuery.getScript( "./beatblaster/js/preloadjs-0.4.0.min.js",
        function( data, textStatus, jqxhr ) {
            console.log( "Preloader: " + textStatus );
            if ( jqxhr.status !== 200 ) {
                // Load failed, abort
                console.log( "Couldn't load preload, status: " + textStatus );
                return;
            } else {
                // Preloader loaded, start loading
                loader.loadLibraries();
            }
        } );
}

Loader.prototype.fileLoaded = function( event ) {
    var item = event.item;
    console.log( "File loaded:" );
    console.log( item )
};

Loader.prototype.loadError = function( event ) {
    console.log( "Load error: " );
    console.log( event );
};

Loader.prototype.loadLibraries = function() {

    this.queue = new createjs.LoadQueue( this.useXHR );

    // Add event listeners
    this.queue.addEventListener( "fileload", this.fileLoaded.bind( this ) );
    this.queue.addEventListener( "error", this.loadError.bind( this ) );
    this.queue.addEventListener( "complete",
        this.librariesLoaded.bind( this ) );

    // Build queue
    // Using separate builder functions for this did not work: 
    // have to build the queue here
    this.queue.loadManifest( [ {
        id: "easeljs",
        src: "./beatblaster/js/easeljs-0.7.0.min.js",
        type: createjs.LoadQueue.JAVASCRIPT
    }, {
        id: "soundjs",
        src: "./beatblaster/js/soundjs-0.5.0.min.js",
        type: createjs.LoadQueue.JAVASCRIPT
    } ] );
    console.log( "Queue built" );
};

Loader.prototype.librariesLoaded = function( event ) {
    console.log( "Finished loading libs, load the rest" );
    this.loadAssets();
};

Loader.prototype.loadAssets = function() {
    this.queue.close();
    this.queue = new createjs.LoadQueue( this.useXHR );

    this.queue.addEventListener( "fileload", this.assetLoaded.bind( this ) );
    this.queue.addEventListener( "error", this.loadError.bind( this ) );
    this.queue.addEventListener( "complete", this.assetsLoaded.bind( this ) );

    this.queue.loadManifest( [ {
        id: "playerSpriteheet",
        src: "./beatblaster/img/spaceshipsprites.gif",
        type: createjs.LoadQueue.IMAGE,
        data: {
            // Data about the sprite sheet (frame size, animations)
            type: "spritesheet"
        }
    } ] );

};

Loader.prototype.assetLoaded = function( event ) {
    console.log( event.item );
    if (event.item.type === createjs.LoadQueue.IMAGE) {
        console.log("Loaded image");
        
    }
};

Loader.prototype.assetsLoaded = function( event ) {
    this.callback();
};