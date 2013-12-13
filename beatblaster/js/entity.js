// A class representing entities in the game
function Entity( image, moveFunction ) {
    this.img = image;
    this.moveFunction = moveFunction;
}

// PlayerEntity inherits Entity
PlayerEntity.prototype = new Entity();
PlayerEntity.prototype.constructor = PlayerEntity;

function PlayerEntity( image, moveFunction ) {
    Entity.call( image, moveFunction );
}