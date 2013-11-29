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

var FFTSIZE = 128;
var FREQBANDS = 64; // max FFTSIZE/2 ! 
var soundFile = "beatblaster/mp3/Daft_Punk-Crescendolls.mp3";
var HEIGHT_FACTOR = 400.0;
var MIN_HEIGHT = 0;

var stage, h, w;
var statusText;
var soundInstance;
var analyserNode;
var freqFloatData, freqByteData, timeByteData;
var freqChunk;
var bands = {};

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
	createjs.Sound.registerSound(soundFile);

}

function musicLoaded(evt) {
	// update screen
	console.log("Music file loaded!");
	statusText.text = "Click anywhere to start (note: volume might be high!)";
	stage.update();
	//initialize the analyzer
	var context = createjs.WebAudioPlugin.context;
	analyserNode = context.createAnalyser();
	analyserNode.fftSize = FFTSIZE;
	analyserNode.smoothingTimeConstant = 0.8;
	analyserNode.connect(context.destination);
	// insert the analyzer
	var dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
	dynamicsNode.disconnect();  // disconnect from destination
	dynamicsNode.connect(analyserNode);
	// prepare data arrays
	freqFloatData = new Float32Array(analyserNode.frequencyBinCount);
	freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
	timeByteData = new Uint8Array(analyserNode.frequencyBinCount);	
	// how many array elements per band
	freqChunk = analyserNode.frequencyBinCount / FREQBANDS;
	// prepare mouse click
	stage.addEventListener("stagemousedown", startTestLoop);
}

// loopattavat funktiot
function logic(delta) {
	
	analyserNode.getFloatFrequencyData(freqFloatData);  // this gives us the dBs
	analyserNode.getByteFrequencyData(freqByteData);  // this gives us the frequency
	analyserNode.getByteTimeDomainData(timeByteData);  // this gives us the waveform
	
	for(var i=0; i<FREQBANDS; i++) {
		var freqSum = 0;
		var timeSum = 0;
		for(var x = freqChunk; x; x--) {
			var index = (FREQBANDS-i)*freqChunk-x;
			freqSum += freqByteData[index];
			timeSum += timeByteData[index];
		}
		freqSum = freqSum / freqChunk / 255;  // gives us a percentage out of the total possible value
		timeSum = timeSum / freqChunk / 255;  // gives us a percentage out of the total possible value
		// NOTE in testing it was determined that i 1 thru 4 stay 0's most of the time

		// draw circle
		var hh = freqSum*HEIGHT_FACTOR + MIN_HEIGHT;
		var ww = w/FREQBANDS;
		var color = createjs.Graphics.getRGB(80,120,70);
		var g = new createjs.Graphics().beginFill(color).drawRect((FREQBANDS-i-1)*ww,480-hh,ww,hh).endFill();
		bands[i].graphics = g;
	}
	
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
	// remove status text and listener
	stage.removeEventListener("stagemousedown", startTestLoop);
	stage.removeChild(statusText);
	stage.update();
	
	// start playing
	if(soundInstance) {return;} 
	soundInstance = createjs.Sound.play(soundFile, {loop:-1});
	
	// create the bands
	for(var i=0; i<FREQBANDS; i++) {
		var band = bands[i] = new createjs.Shape();
		stage.addChild(band);
	}
	
	// start loop
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

