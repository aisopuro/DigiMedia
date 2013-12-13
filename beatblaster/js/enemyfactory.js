// A class for managing enemy types and spawning EnemyEntities
EnemyFactory = {
    MARGIN_MULTIPLIER: 2,
    BASIC_ENEMY: 0,
    buildEnemy: function( enemyType, stage, startOffsetX, startOffsetY ) {
        var enemy = {};
        if ( enemyType === this.BASIC_ENEMY ) {
            var img = new createjs.Shape();
            img.graphics.beginFill( "FF0" ).drawRoundRect( 0, 0, 100, 100, 3 );
            img.setBounds( 0, 0, 100, 100 );
            enemy = new Entity( stage, img, undefined, 
                100 + startOffsetX, -100 + startOffsetY );

            enemy.margin = this.MARGIN_MULTIPLIER * 100;
            enemy.move = function() {
                this.img.y += 7;
            }.bind( enemy );
        }

        // The following apply to all enemies
        enemy.stageBounds = stage.getBounds();

        enemy.outOfBounds = function() {
            var edges = this.img.getTransformedBounds();
            var bool = !(
                edges.x >= this.stageBounds.x - this.margin &&
                edges.y >= this.stageBounds.y - this.margin &&
                edges.x + edges.width <= this.stageBounds.x + this.stageBounds.width + this.margin &&
                edges.y + edges.height <= this.stageBounds.y + this.stageBounds.height + this.margin
            );
            return bool;
        }.bind( enemy );

        return enemy;

    },
    getNextWave: function(stage) {
        var wave = [];
        for (var i = 0; i < 3; i++) {
            wave.push(this.buildEnemy(this.BASIC_ENEMY, stage, 200 * i, -50 * i));
        }
    }
}