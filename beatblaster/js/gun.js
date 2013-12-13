// Gun - a class representing a point on a ship that fires certain kinds of 
// projectiles. The owning class is responsible for ensuring it is fired at
// correct beats
function Gun( ownerImage, projectileImage, shoot ) {
    this.ownerImage = ownerImage;
    this.image = projectileImage;
    this.shoot = shoot;
    if (this.shoot === undefined) {
        // Do nothing
        this.shoot = function() {
            
        }
    }
}