// An object for building entities
EntityBuilder = {
    build: function( buildPlayer, specs ) {
        if ( buildPlayer ) {
            // Build a player entity
            // Contruct player object
            img = new createjs.Shape();
            // Blue triangle
            img.graphics.beginFill( "00F" ).drawPolyStar( 100, 100, 50, 3, 0, -90 );
            // EaselJS doesn't support automatic boundary calculation for Shape, 
            // so these are magic numbers
            img.setBounds( 55, 50, 90, 80 );
            var player = new PlayerEntity( specs.stage, img, specs.startX,
                specs.startY );
            player.img = img;
            this.stage.addChild( img );
            player.projectiles = [];
            // Lasers
            player.getGunLocation = function() {
                return {
                    x: this.img.x + 94,
                    y: this.img.y + 10
                }
            }.bind( player );
            var temp = ProjectileBuilder.build( Constants.NOTE_BASS, player.img, this.stage );
            player.projectiles.push( temp );
        } else {
            // build an enemyentity
        }
    }
}