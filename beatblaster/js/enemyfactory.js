// A class for managing enemy types and spawning EnemyEntities
EnemyFactory = {
    MARGIN_MULTIPLIER: 2,
    EASY_ENEMY: 0,
	BASIC_ENEMY: 1,
	MEDIUM_ENEMY: 2,
	HARD_ENEMY: 3,
    buildEnemy: function( enemyType, stage, startOffsetX, startOffsetY ) {
        var enemy = {};
        enemy.hp = 1;
        enemy.score = 0;
        if ( enemyType === this.EASY_ENEMY ) {
            var img = EnemyFactory.bitmaps[Constants.ENEMY1_ID].clone();
            img.setBounds( 0, 0, 60, 60 );
            enemy = new Entity( stage, img, undefined,
                100 + startOffsetX, -100 + startOffsetY );

            enemy.margin = this.MARGIN_MULTIPLIER * 100;
            enemy.hp = 2;
            enemy.move = function() {
                this.img.y += 7;
            }.bind( enemy );
        } else if ( enemyType === this.BASIC_ENEMY ) {
            var img = EnemyFactory.bitmaps[Constants.ENEMY2_ID].clone();
            img.setBounds( 0, 0, 60, 60 );
            enemy = new Entity( stage, img, undefined,
                100 + startOffsetX, -100 + startOffsetY );

            enemy.margin = this.MARGIN_MULTIPLIER * 100;
            enemy.hp = 10;
            enemy.move = function() {
                this.img.y += 7;
            }.bind( enemy );
        } else if ( enemyType === this.MEDIUM_ENEMY ) {
            var img = EnemyFactory.bitmaps[Constants.ENEMY3_ID].clone();
            img.setBounds( 0, 0, 60, 60 );
            enemy = new Entity( stage, img, undefined,
                100 + startOffsetX, -100 + startOffsetY );

            enemy.margin = this.MARGIN_MULTIPLIER * 100;
            enemy.hp = 20;
            enemy.move = function() {
                this.img.y += 7;
            }.bind( enemy );
        } else if ( enemyType === this.HARD_ENEMY ) {
            var img = EnemyFactory.bitmaps[Constants.ENEMY4_ID].clone();
            img.setBounds( 0, 0, 60, 60 );
            enemy = new Entity( stage, img, undefined,
                100 + startOffsetX, -100 + startOffsetY );

            enemy.margin = this.MARGIN_MULTIPLIER * 100;
            enemy.hp = 40;
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

        enemy.hitBy = function( projectile ) {
            this.hp -= projectile.img.damageValue;
            var result = -1;
            if (this.hp <= 0)
                result = this.score;
            return result;
        }

        return enemy;

    },
    getNextWave: function( stage ) {
        var wave = [];
        for ( var i = 0; i < 3; i++ ) {
            wave.push( this.buildEnemy( this.BASIC_ENEMY, stage, 200 * i, -50 * i ) );
        }
        return wave;
    }
}