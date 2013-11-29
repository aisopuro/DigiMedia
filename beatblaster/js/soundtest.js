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

var FFTSIZE = 256;
var FREQBANDS = 128; // max FFTSIZE/2 ! 
//var soundFile = "beatblaster/mp3/Deadmau5-Channel_42.mp3";
var soundFile = "beatblaster/mp3/Daft_Punk-Crescendolls.mp3";
var HEIGHT_FACTOR = 400.0;
var MIN_HEIGHT = 0;
var HISTOGRAM = 20;

var stage, h, w;
var statusText, beatText, trebText;
var soundInstance;
var analyserNode;
var freqFloatData, freqByteData, timeByteData;
var freqChunk;
var bands = {};

var follow = {
		beat:{
			Intensity: 0.0,
			Bands: { "start":0, "end":1 },
			Treshold: 1.3,
			IntensityTreshold: 225,
			IntensityAutoTrigger: 250,
			Previous: []
		},
		treble:{
			Intensity: 0.0,
			Bands: { "start":75, "end":100 },
			Treshold: 1.6,
			IntensityTreshold: 40,
			IntensityAutoTrigger: 100,
			Previous: []
		}
};
for (var i = 0; i < HISTOGRAM; i++) {
	follow.beat.Previous.push(0);
	follow.treble.Previous.push(0);
}
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
	statusText.text = "Click anywhere to start (note: volume might be high!)";
	stage.update();
	//initialize the analyzer
	var context = createjs.WebAudioPlugin.context;
	analyserNode = context.createAnalyser();
	analyserNode.fftSize = FFTSIZE;
	analyserNode.smoothingTimeConstant = 0;
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

function checkEnergy(what) {
	var sum = 0;
	var obj = what;
	for(var i=obj.Bands.start; i<obj.Bands.end; i++) {
		sum += freqByteData[i];
	}
	sum /= obj.Bands.end-obj.Bands.start;
	var tot = 0.0;
	for(var i=0; i<obj.Previous.length; i++) {
		tot += obj.Previous[i];
	}
	var avg = tot/obj.Previous.length;
	
	obj.Previous.shift();
	obj.Previous.push(sum);
	
	obj.Intensity *= 0.9;
	
	if (avg > 0) {
		if (sum >= obj.IntensityAutoTrigger || ( sum/avg >= obj.Treshold && sum >= obj.IntensityTreshold) ) {
			obj.Intensity = 1.0;
		}
	}
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

		var hh = freqSum*HEIGHT_FACTOR + MIN_HEIGHT;
		var ww = w/FREQBANDS;
		// fills a rectangle with a gradient
		var g = new createjs.Graphics().beginLinearGradientFill(["rgb(80,120,70)","rgb(30,30,30)"], [0.5, 1], 0, 480-hh, 0, 480)
							.drawRect((FREQBANDS-i-1)*ww,480-hh,ww,hh).endFill();
		bands[i].graphics = g;
	}

	checkEnergy(follow.beat);
	checkEnergy(follow.treble);
	
	var cc = Math.floor(255.0*follow.beat.Intensity);
	var col = createjs.Graphics.getRGB(cc,cc,cc);
	beatText.color = col;
	
	cc = Math.floor(255.0*follow.treble.Intensity);
	col = createjs.Graphics.getRGB(cc,cc,cc);
	trebText.color = col;
	
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
	
	beatText = new createjs.Text("SUBBASS", "bold 24px Arial", "#000");
	beatText.maxWidth = w;
	beatText.textAlign = "center";
	beatText.x = 60;
	beatText.y = 50;
	stage.addChild(beatText);
	
	trebText = new createjs.Text("TREBLE", "bold 24px Arial", "#000");
	trebText.maxWidth = w;
	trebText.textAlign = "center";
	trebText.x = 400;
	trebText.y = 50;
	stage.addChild(trebText);
	
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

