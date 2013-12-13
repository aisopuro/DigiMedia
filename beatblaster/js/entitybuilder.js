// An object for building entities
EntityBuilder = {
    build: function( buildPlayer, specs ) {
        var entity;
        if ( buildPlayer ) {
            // Build a player entity
            // Contruct player object
            img = new createjs.Shape();
            // Blue triangle
            img.graphics.beginFill( "00F" ).drawPolyStar( 100, 100, 50, 3, 0, -90 );
            // EaselJS doesn't support automatic boundary calculation for Shape, 
            // so these are magic numbers
            img.setBounds( 55, 50, 90, 80 );
            entity = new PlayerEntity( specs.stage, img, specs.startX,
                specs.startY );

        } else {
            // build an enemyentity
            img = createjs.Shape();
            img.graphicsbeginFill("FF0").drawRectangle(0,0,100,100);
            img.setBounds(0,0,100,100);
        }
        return entity;
    }
}