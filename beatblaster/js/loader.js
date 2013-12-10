// Class for handling file loading. Returns a list of LoadQueue item-objects as 
// an argument to the specified callback function
function Loader( callback ) {
    console.log( "init loader" );
    this.callback = callback;
    this.callbackName = "callbackName";
    this.queue;
    this.loadedAssets = [];
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

Loader.prototype.loadComplete = function() {
    this.callback( this.loadedAssets );
};

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
    var basepath = "./beatblaster/js/"
    this.queue.loadManifest( [
            "easeljs-0.7.0.min.js",
            "soundjs-0.5.0.min.js",
            "soundhandler.js",
            "builder.js",
            "constants.js",
            "gamemanager.js",
            "Queue.compressed.js"
        ], 
        true,
        basepath );
    console.log( "Queue built" );
};

Loader.prototype.librariesLoaded = function( event ) {
    console.log( "Finished loading libs, load the rest" );
    this.loadAssets();
};

Loader.prototype.loadAssets = function() {
    this.queue.removeAllEventListeners();

    this.queue.addEventListener( "fileload", this.assetLoaded.bind( this ) );
    this.queue.addEventListener( "error", this.loadError.bind( this ) );
    this.queue.addEventListener( "complete", this.assetsLoaded.bind( this ) );

    this.queue.loadManifest( [ {
        id: Constants.IMAGE_ID_PLAYER,
        src: Constants.PATH_TO_PLAYER_IMAGE,
        type: createjs.LoadQueue.IMAGE,
        data: {
            // Data about the sprite sheet (frame size, animations)
            type: "spritesheet"
        }
    } ] );

};

Loader.prototype.assetLoaded = function( event ) {
    console.log( event.item );
    var item = event.item;
    var data = item.data;
    if ( data === undefined || data === null ) {
        data = {
            type: ""
        }
    }
    if ( item.type === createjs.LoadQueue.IMAGE ) {
        console.log( "Loaded image" );
        if ( data.type === "spritesheet" ) {
            console.log( "Image was a spritesheet" );
            this.loadedAssets.push( item );
        }
    } else if ( item.type === createjs.LoadQueue.SOUND ) {
        // Loaded sound
        this.loadedAssets.push( item );
    }
};

Loader.prototype.assetsLoaded = function( event ) {
    this.loadComplete();
};