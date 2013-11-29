// selainyhteensopivuus
window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();


// testifunktio
function tick(delta) {
	console.log(delta);
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

