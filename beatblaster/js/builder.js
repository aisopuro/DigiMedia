// Builder class for constructing the necessary assets and linking them to a stage
function Builder( stage, loadedAssets, completionCallback ) {
    this.stage = stage;
    this.assets = loadedAssets;
    this.complete = completionCallback;
    this.entities = {};

    this.build()
}

// main build function for putting everything together
Builder.prototype.build = function() {
    console.log( "Building..." );
    console.log( this.stage );
    console.log( this.assets );

    // Extract assets from asset list
    jQuery.each( this.assets, function( index, item ) {
        console.log( index );
        console.log( item );
        var data = item.data;

        if ( item.type === createjs.LoadQueue.IMAGE ) {
            var img = new createjs.Bitmap( item.src );

            if ( item.id === Constants.IMAGE_ID_PLAYER ) {
                console.log( "playerImage:" );
                // Contruct player object
                img = new createjs.Shape();
                // Blue triangle
                img.graphics.beginFill( "00F" ).drawPolyStar( 100, 100, 50, 3, 0, -90 );
                img.setBounds(55, 50, 90, 80);
                var player = {};
                player.img = img;
                this.stage.addChild( img );
                player.projectiles = [];
                // Lasers
                player.getGunLocation = function() {
                    return {
                        x: this.img.x + 94,
                        y: this.img.y + 10
                    }
                }.bind(player);
                var temp = ProjectileBuilder.build(Constants.NOTE_BASS, player.img, this.stage);
                player.projectiles.push( temp );

                this.entities.player = player;
                console.log( this.entities.player );
            }
        }
        else if (item.id === Constants.TIMELINE_ID) {
            // Timeline JSON
        }

    }.bind( this ) );

    // Building complete, return finished stage to caller
    this.complete( this.stage, this.entities );
};