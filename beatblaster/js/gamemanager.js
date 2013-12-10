// A class for managing the basic gameplay loop
function GameManager (stage, entities, fps) {
    console.log("manager");
    this.stage = stage;
    this.entities = entities;
    this.fps = fps;
    this.mspf = 1000 / fps; // ms per 
    this.queue = new Queue(); // Event queue

    this.setUpListeners();
    createjs.Ticker.addEventListener("tick", this.frameTick.bind(this));
}

GameManager.prototype.setUpListeners = function() {
    jQuery(document).keydown(this.keyDown.bind(this));
};

GameManager.prototype.frameTick = function(event) {
    this.stage.update();
};

GameManager.prototype.keyDown = function(event) {
    // Key depressed
};