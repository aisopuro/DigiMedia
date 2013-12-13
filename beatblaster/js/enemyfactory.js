// A class for managing enemy types and spawning EnemyEntities
EnemyFactory {
    BASIC_ENEMY: 0,
    buildEnemy: function( enemyType, stage ) {
        var enemy;
        if ( enemyType === BASIC_ENEMY ) {
            var img = new createjs.Shape();
            img.graphics.beginFill( "FF0" ).drawRoundRect( 0, 0, 100, 100, 3 );
            img.setBounds( 0, 0, 100, 100 );

            enemy = new Entity( stage, img, undefined, 250, -50 );

            enemy.move = function() {
                this.img.y += 7;
            }.bind(enemy);
        }

    }
}