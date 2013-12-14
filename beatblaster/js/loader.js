/*Class for handling file loading. Returns a list of LoadQueue item-objects as 
an argument to the specified callback function
Loader's main duties are to ensure that all assets that cannot be preloaded 
by the createjs classes that use them are preloaded here. The most important
function is the loading of the necessary libraries.
@callback: the function to call once loading is complete
*/
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

Loader.prototype.loadError = function( event ) {
    console.log( "Load error: " );
    console.log( event );
};

Loader.prototype.loadLibraries = function() {

    this.queue = new createjs.LoadQueue( this.useXHR );

    // Add event listeners
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
            "Queue.compressed.js",
            "entitybuilder.js",
            "entity.js",
            "gun.js",
            "background.js",
            "enemyfactory.js"
        ],
        true,
        basepath );
    console.log( "Queue built" );
};

Loader.prototype.librariesLoaded = function( event ) {
    this.loadAssets();
};

// The function that handles asset loading.
Loader.prototype.loadAssets = function() {
    this.queue.removeAllEventListeners();

    this.queue.addEventListener( "fileload", this.assetLoaded.bind( this ) );
    this.queue.addEventListener( "error", this.loadError.bind( this ) );
    this.queue.addEventListener( "complete", this.assetsLoaded.bind( this ) );

    createjs.Sound.registerPlugins( [ createjs.WebAudioPlugin, createjs.FlashPlugin ] );
    this.queue.installPlugin( createjs.Sound );

    this.queue.loadManifest( [ {
        id: Constants.IMAGE_ID_PLAYER,
        src: Constants.PATH_TO_PLAYER_IMAGE,
        type: createjs.LoadQueue.IMAGE,
    }, {
        id: Constants.TIMELINE_ID,
        src: Constants.TIMELINE_SRC,
        type: createjs.LoadQueue.JSON
    }, {
        id: Constants.BGMUSIC_ID,
        src: Constants.BGMUSIC_SRC,
        type: createjs.LoadQueue.SOUND
    }, {
        id: Constants.ENEMY1_ID,
        src: Constants.ENEMY1_SRC,
        type: createjs.LoadQueue.IMAGE
    }, {
        id: Constants.ENEMY2_ID,
        src: Constants.ENEMY2_SRC,
        type: createjs.LoadQueue.IMAGE
    }, {
        id: Constants.ENEMY3_ID,
        src: Constants.ENEMY3_SRC,
        type: createjs.LoadQueue.IMAGE
    }, {
        id: Constants.ENEMY4_ID,
        src: Constants.ENEMY4_SRC,
        type: createjs.LoadQueue.IMAGE
    } ] );

};

Loader.prototype.assetLoaded = function( event ) {
    console.log( event.item );
    var item = event.item;
    if ( item.type === createjs.LoadQueue.IMAGE ) {
        item.data = event.result;
        this.loadedAssets.push( item );
    } else if ( item.type === createjs.LoadQueue.SOUND ) {
        // Loaded sound
        item.data = event.result;
        this.loadedAssets.push( item );
    } else if ( item.type === createjs.LoadQueue.JSON ) {
        // Loaded json
        item.data = event.result;
        this.loadedAssets.push( item );
    }

};

Loader.prototype.assetsLoaded = function( event ) {
    this.loadComplete();
};