
function Background( stage, starcount, layers ) {
	this.back = new createjs.Shape();
	this.bounds = stage.getBounds();
	this.back.graphics.beginFill("#000").drawRect(0, 0, this.bounds.width, this.bounds.height);
}

Background.prototype.updateStars = function(playerX, playerY){
	
}