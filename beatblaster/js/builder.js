// Builder class for constructing the necessary assets and linking them to a stage
function Builder( stage, loadedAssets, completionCallback ) {
    this.stage = stage;
    this.assets = loadedAssets;
    this.complete = completionCallback;
    this.entities = {};
	this.bitmaps = {};

    this.build()
}

// main build function for putting everything together
Builder.prototype.build = function() {
    console.log( "Building..." );
    console.log( this.stage );
    console.log( this.assets );
	
	this.entities.bg = new Background(this.stage, 50, 4);
	
    // Extract assets from asset list
    jQuery.each( this.assets, function( index, item ) {
        console.log( index );
        console.log( item );
        var data = item.data;

        if ( item.type === createjs.LoadQueue.IMAGE ) {
            var img = new createjs.Bitmap( item.src );

            if ( item.id === Constants.IMAGE_ID_PLAYER ) {
                console.log( "playerImage:" );
                var player = EntityBuilder.build( true, {
                    stage: this.stage,
                    startX: 200,
                    startY: 400
                } );
                player.projectiles = []; // Patch

                this.entities.player = player;
            } 
			if (  item.id === Constants.ENEMY1_ID 
				||item.id === Constants.ENEMY2_ID 
				||item.id === Constants.ENEMY3_ID 
				||item.id === Constants.ENEMY4_ID ) {
				// do something?
			}
			
			this.bitmaps[item.id] = img;
			
        } else if ( item.id === Constants.TIMELINE_ID ) {
            // Timeline JSON
            this.entities.soundHandler = new SoundHandler( this.stage, item.data );
        } else if ( item.id === Constants.BGMUSIC_ID ) {
			if (this.entities.soundHandler) {
				this.entities.soundHandler.registerMusic(Constants.BGMUSIC_ID);
			} else {
				console.log("no sound handler present, bug?"); // Not really, there aren't any guarantees which will emerge from the queue first
			}
		}

    }.bind( this ) );
	
	EnemyFactory.bitmaps = this.bitmaps;
	
    // Building complete, return finished stage to caller
    this.complete( this.stage, this.entities );
};