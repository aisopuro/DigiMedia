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
                var player = {};
                player.img = img;
                player.projectiles = [ {
                    img: new createjs.Shape().graphics.beginFill( "#ff0000" ).drawRect( 0, 0, 10, 100 ),
                    beatType: 0,
                    nextPoint: function( x, y ) {
                        return {
                            x: x,
                            y: y - 10
                        }
                    }
                } ]
                this.entities.player = img;
                console.log( this.entities.player );
            }
            this.stage.addChild( img );
        }

    }.bind( this ) );

    // Building complete, return finished stage to caller
    this.complete( this.stage, this.entities );
};