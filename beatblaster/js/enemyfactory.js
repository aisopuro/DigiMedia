/*
 A class for managing enemy types and spawning EnemyEntities
The EnemyFactory is used to produce copies of appropriate enemy images, wrapped
in objects that contain necessary data fields and functions. It is also 
responsible for suppying enemy waves, taking care of their placement and 
composition.
*/
EnemyFactory = {
    MARGIN_MULTIPLIER: 4,
    EASY_ENEMY: 0,
    BASIC_ENEMY: 1,
    MEDIUM_ENEMY: 2,
    HARD_ENEMY: 3,
    LastSentWave: 0,
    /* A function for building a single enemy Entity.
    @enemyType: the type of enemy to be built
    @stage: the stage the enemy is to be associated with
    @startOffsetX: the amount by which to shift the enemy's starting position
    along the x-axis. Enemies by default spawn into the upper left corner.
    @startOffsetY: as above, but for the y-axis. Note that the axis is reversed:
    increasing the value shifts objects downward.
    */
    buildEnemy: function( enemyType, stage, startOffsetX, startOffsetY ) {
        var enemy = {};
        enemy.hp = 1;
        enemy.score = 0;
        // Change the enemy object depending on parameters
        if ( enemyType === this.EASY_ENEMY ) {
            var img = EnemyFactory.bitmaps[ Constants.ENEMY1_ID ].clone();
            img.setBounds( 0, 0, 60, 60 );
            enemy = new Entity( stage, img, undefined,
                100 + startOffsetX, -100 + startOffsetY );

            enemy.margin = this.MARGIN_MULTIPLIER * 100;
            enemy.hp = 2;
            enemy.score = 10;
            enemy.move = function() {
                this.img.y += 5;
            }.bind( enemy );
        } else if ( enemyType === this.BASIC_ENEMY ) {
            var img = EnemyFactory.bitmaps[ Constants.ENEMY2_ID ].clone();
            img.setBounds( 0, 0, 60, 60 );
            enemy = new Entity( stage, img, undefined,
                100 + startOffsetX, -100 + startOffsetY );

            enemy.margin = this.MARGIN_MULTIPLIER * 100;
            enemy.hp = 10;
            enemy.score = 20;
            enemy.speedX = -1 + ( Math.random() * 2 );
            enemy.move = function() {
                this.img.y += 6;
                this.img.x += this.speedX;
            }.bind( enemy );
        } else if ( enemyType === this.MEDIUM_ENEMY ) {
            var img = EnemyFactory.bitmaps[ Constants.ENEMY3_ID ].clone();
            img.setBounds( 0, 0, 60, 60 );
            enemy = new Entity( stage, img, undefined,
                100 + startOffsetX, -100 + startOffsetY );

            enemy.margin = this.MARGIN_MULTIPLIER * 100;
            enemy.hp = 20;
            enemy.score = 30;
            enemy.move = function() {
                this.img.y += 5;
            }.bind( enemy );
        } else if ( enemyType === this.HARD_ENEMY ) {
            var img = EnemyFactory.bitmaps[ Constants.ENEMY4_ID ].clone();
            img.setBounds( 0, 0, 60, 60 );
            enemy = new Entity( stage, img, undefined,
                100 + startOffsetX, -100 + startOffsetY );

            enemy.margin = this.MARGIN_MULTIPLIER * 100;
            enemy.hp = 40;
            enemy.score = 40;
            enemy.move = function() {
                this.img.y += 4;
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
            if ( this.hp <= 0 )
                result = this.score;
            return result;
        }

        return enemy;

    },
    waveData: [
        [ {
            mtype: 0,
            count: 3
        } ],
        [ {
            mtype: 0,
            count: 4
        } ],
        [ {
            mtype: 0,
            count: 5
        } ],
        [ {
            mtype: 0,
            count: 3
        }, {
            mtype: 0,
            count: 3
        } ],
        [ {
            mtype: 0,
            count: 5
        }, {
            mtype: 0,
            count: 5
        } ],
        [ {
            mtype: 1,
            count: 5
        } ],
        [ {
            mtype: 1,
            count: 6
        } ],
        [ {
            mtype: 1,
            count: 5
        }, {
            mtype: 1,
            count: 5
        } ],
        [ {
            mtype: 1,
            count: 5
        }, {
            mtype: 1,
            count: 6
        } ],
        [ {
            mtype: 1,
            count: 5
        }, {
            mtype: 2,
            count: 3
        } ],
        [ {
            mtype: 2,
            count: 4
        } ],
        [ {
            mtype: 2,
            count: 5
        }, {
            mtype: 2,
            count: 5
        } ],
        [ {
            mtype: 3,
            count: 3
        } ],
        [ {
            mtype: 3,
            count: 4
        }, {
            mtype: 3,
            count: 4
        } ],
        [ {
            mtype: 3,
            count: 6
        }, {
            mtype: 3,
            count: 6
        } ],
        [ {
            mtype: 0,
            count: 6
        }, {
            mtype: 1,
            count: 6
        }, {
            mtype: 2,
            count: 6
        }, {
            mtype: 3,
            count: 6
        } ],
        [ {
            mtype: 1,
            count: 6
        }, {
            mtype: 2,
            count: 6
        }, {
            mtype: 1,
            count: 6
        }, {
            mtype: 0,
            count: 6
        } ],
        [ {
            mtype: 3,
            count: 4
        }, {
            mtype: 3,
            count: 5
        }, {
            mtype: 3,
            count: 6
        } ]
    ],
    getNextWave: function( stage ) {
        var stageBounds = stage.getBounds();
        var wave = [];
        var toBeSent = this.LastSentWave % this.waveData.length;
        var data = this.waveData[ toBeSent ];
        for ( var i = 0; i < data.length; i++ ) {
            var monster = data[ i ];
            for ( var j = 0; j < monster.count; j++ ) {
                wave.push( this.buildEnemy( monster.mtype, stage, -50 + ( stageBounds.width / monster.count ) * j, -30 - 65 * i ) );
            }
        }
        EnemyFactory.LastSentWave++;
        return wave;
    }
}