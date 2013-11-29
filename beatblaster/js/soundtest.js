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

// apufunktiot
function clear() {
	var c = canvas.getContext("2d");
	c.fillStyle = "rgb(0,0,0)";
	c.fillRect(0, 0, canvas.width, canvas.height);
}

// loopattavat funktiot
function logic(delta) {
	
}

function draw() {
	clear();
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

startTestLoop();

