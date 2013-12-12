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
                img.graphics.beginFill( "00F" ).drawPolyStar( 100, 100, 50, 3, 0, -90 );
                var player = {};
                player.img = img;
                player.projectiles = [];
                // Lasers
                var temp = {
                    beatType: 0,
                    nextPoint: function( x, y ) {
                        return {
                            x: x,
                            y: y - 10
                        }
                    },
                    cursor: 0,
                    imageCount: Constants.PROJECTILE_ARRAY_SIZE_LASER,
                    images: []
                };
                var image = new createjs.Shape();
                image.graphics.beginFill( "#ff0000" ).drawRoundRect( 0, 0, 10, 50, 5 );
                image.setBounds( 0, 0, 100, 100 );
                image.x = -1000;
                image.y = -1000;
                for ( var i = 0; i < Constants.PROJECTILE_ARRAY_SIZE_LASER; i++ ) {
                    var currentClone = image.clone();
                    currentClone.active = false;
                    temp.images.push( currentClone );
                    this.stage.addChild( currentClone );
                }
                player.projectiles.push( temp );

                this.entities.player = player;
                console.log( this.entities.player );
            }
            this.stage.addChild( img );
        }

    }.bind( this ) );

    // Building complete, return finished stage to caller
    this.complete( this.stage, this.entities );
};