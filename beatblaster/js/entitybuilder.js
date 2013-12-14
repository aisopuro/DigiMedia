/* A constructor object for building entities.
@buildPlayer: a boolean indicating what kind of entity to build: true for player
@specs: an object containing specifications */
EntityBuilder = {
    build: function( buildPlayer, specs ) {
        var entity;
        if ( buildPlayer ) {
            // Build a player entity
            // Contruct player object
            var img = new createjs.Shape();
            // Blue triangle
            img.graphics.beginFill( "00F" ).drawPolyStar( 100, 100, 30, 3, 0, -90 );
            // EaselJS doesn't support automatic boundary calculation for Shape, 
            // so these are magic numbers
            img.setBounds(
                Constants.PLAYER_BOUND_LEFT,
                Constants.PLAYER_BOUND_UP,
                Constants.PLAYER_BOUND_RIGHT,
                Constants.PLAYER_BOUND_DOWN
            );
            entity = new PlayerEntity( specs.stage, img, specs.startX,
                specs.startY );

        } else {
            // build an enemyentity
            var img = new createjs.Shape();
            img.graphics.beginFill( "FF0" ).drawRoundRect( 0, 0, 100, 100, 2 );
            img.setBounds( 0, 0, 100, 100 );

            entity = new Entity( specs.stage, img, undefined, specs.startX,
                specs.startY );
        }
        return entity;
    }
}