
function Background( stage, starcount, layers ) {
	var bg = new createjs.Shape();
	this.bounds = stage.getBounds();
	bg.graphics.beginFill("#000").drawRect(0, 0, this.bounds.width, this.bounds.height);
	stage.addChild(bg);
	this.back = bg;	
}

Background.prototype.updateStars = function(playerX, playerY){
	
}