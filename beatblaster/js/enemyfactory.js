// A class for managing enemy types and spawning EnemyEntities
EnemyFactory = {
    MARGIN_MULTIPLIER: 2,
    BASIC_ENEMY: 0,
    buildEnemy: function( enemyType, stage ) {
        var enemy = {};
        if ( enemyType === this.BASIC_ENEMY ) {
            var img = new createjs.Shape();
            img.graphics.beginFill( "FF0" ).drawRoundRect( 0, 0, 100, 100, 3 );
            img.setBounds( 0, 0, 100, 100 );
            enemy = new Entity( stage, img, undefined, 250, -50 );

            enemy.margin = this.MARGIN_MULTIPLIER * 100;
            enemy.move = function() {
                this.img.y += 7;
            }.bind( enemy );
        }

        // The following apply to all enemies
        enemy.stageBounds = stage.getBounds();

        enemy.outOfBounds = function() {
            var edges = this.img.getTransformedBounds();
            console.log( edges );
            console.log( this.stageBounds );
            console.log( this.margin );
            var bool = !(
                edges.x >= this.stageBounds.x - this.margin &&
                edges.y >= this.stageBounds.y - this.margin &&
                edges.x + edges.width <= this.stageBounds.x + this.stageBounds.width + this.margin &&
                edges.y + edges.height <= this.stageBounds.y + this.stageBounds.height + this.margin
            );
            console.log( bool );
            return bool;
        }.bind( enemy );

        return enemy;

    }
}