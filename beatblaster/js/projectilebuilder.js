// A class for building projectile entities
ProjectileBuilder = {
    build: function( beatType, parentImg, stage ) {
        var projectile = {};
        projectile.beatType = beatType;
        projectile.cursor = 0;
        // Construct a projectile based on the associated beat type

        if ( beatType === Constants.NOTE_BASS ) { // Dummy
            // Basic laser
            projectile.move = function( image ) {
                image.y = image.y - 10;
            }
            projectile.images = [];
            projectile.imageCount = Constants.PROJECTILE_ARRAY_SIZE_LASER;
            // Red, rounded rectangles
            var image = new createjs.Shape();
            image.graphics.beginFill( "#ff0000" ).drawRoundRect( 0, 0, 10, 50, 5 );
            image.setBounds( 0, 0, 10, 50 );
            image.x = -1000;
            image.y = -1000;
            for ( var i = 0; i < projectile.imageCount; i++ ) {
                var currentClone = image.clone();
                currentClone.active = false;
                projectile.images.push( currentClone );
                stage.addChild(currentClone);            }
        } else {
            // Not a supported beatType
            return null;
        }
        return projectile;
    }
}