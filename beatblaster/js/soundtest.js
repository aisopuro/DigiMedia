// selainyhteensopivuus
window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();

// valmistelut testifunktiolle
var canvas = document.getElementById("testCanvas");
var inited = false;

var FFTSIZE = 32;
var soundFile = "Daft_Punk-Crescendolls.mp3";

var stage, h, w;
var statusText;

// apufunktiot
function init() {
	if (inited) return;
	inited = true;
	// Web Audio tarkistus
	if (!createjs.Sound.registerPlugin(createjs.WebAudioPlugin)) {
		console.log("Unable to start Web Audio");
		return;
	}
	// luo stage
	stage = new createjs.Stage(canvas);
	h = canvas.height;
	w = canvas.width;
	
	// luo tekstirivi
	statusText = new createjs.Text("Loading music file...", "bold 12px Arial", "#FFFFFF");
	statusText.maxWidth = w;
	statusText.textAlign = "left";
	statusText.x = 5;
	statusText.y = 5;
	stage.addChild(statusText);
	
	stage.update();
	
	createjs.Sound.addEventListener("fileload", createjs.proxy(musicLoaded,this));
	createjs.Sound.registerSound("beatblaster/mp3/"+soundFile);

}

function musicLoaded(evt) {
	console.log("Music file loaded!");
	statusText.text = "Click anywhere to start";
	stage.update();
	stage.addEventListener("stagemousedown", startTestLoop);
}

// loopattavat funktiot
function logic(delta) {
	
}

function draw() {
	stage.update();
}

// testifunktio
function tick(delta) {
	logic(delta);
	draw();
}

// looppaus ilman tickeriä

var testRunning = false;
var runLast = Date.now();

function startTestLoop() {
	stage.removeEventListener("stagemousedown", startTestLoop);
	stage.removeChild(statusText);
	testRunning = true;
	requestAnimFrame(testLoop);
}

function endTestLoop() {
	testRunning = false;
}

function testLoop() {
	if (!testRunning) return;
	var now = Date.now();
	var delta = now - runLast;
	tick(delta);
	runLast = now;
	requestAnimFrame(testLoop);
}

init();

