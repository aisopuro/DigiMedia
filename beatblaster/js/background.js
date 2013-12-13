function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Background( stage, starcount, layers ) {
	var bg = new createjs.Shape();
	this.bounds = stage.getBounds();
	bg.graphics.beginFill("#000").drawRect(0, 0, this.bounds.width, this.bounds.height);
	stage.addChild(bg);
	this.back = bg;	
	
	this.globaldampen = 0.2;	
	this.layers = [];
	
	for (var l = 0; l < layers; l++) {
		this.layers[l] = [];
		for (var s = 0; s < starcount; s++) {
			var star = new createjs.Shape();
			star.graphics.beginFill("#FFF").drawCircle(0, 0, 1+l);
			star.x = star.origx = getRandomInt(0, this.bounds.width);
			star.y = star.origy = getRandomInt(0, this.bounds.height);
			stage.addChild(star);
			this.layers[l][s] = star;
		}
	}
	
}

Background.prototype.updateStars = function(playerX, playerY) {
	var lc = this.layers.length;
	for (var l = 0; l < lc; l++) {
		for (var s = 0; s < this.layers[l].length; s++) {
			var star = this.layers[l][s];
			var dampening = (1/lc) * l * this.globaldampen;
			star.x = Math.floor( star.origx - (playerX * dampening) + this.bounds.width) % this.bounds.width;
			star.y = Math.floor( star.origy - (playerY * dampening) + this.bounds.height) % this.bounds.height;
		}
	}
}