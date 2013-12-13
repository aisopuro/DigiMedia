/*

SoundHandler usage: 

Constructor:

	var sh = new SoundHandler( stage, data );
		stage: a target to send the music events for
		data: an array containing the music events timeline
	
	
Music registration saves the music id (call this when the music file load event fires):

	sh.registerMusic( music );
		music: string identifier of the preloaded music file for SoundJS
	
	
Starts to play the music and resets the timeline counter:
	
	sh.startMusic();
	

Call this every tick (after startMusic has been called) so the events get sent:

	sh.tick();
	

*/


function SoundHandler( stage, data ) {
    this.musicfile = 0;
    this.ready = false;
    this.timerstart = Date.now();
    this.timeline = data;
    this.eventStage = stage;

}
// Beat type constants
SoundHandler.BASS = 0;
SoundHandler.SNARE = 1;
SoundHandler.SYNTH1 = 2;
SoundHandler.SYNTH2 = 3;
SoundHandler.SYNTH3 = 4;

SoundHandler.prototype.registerMusic = function( music ) {
    this.musicfile = music;
    this.ready = true;
};

SoundHandler.prototype.startMusic = function() {
	if (!this.ready) {
		console.log("SoundHandler.startMusic called, but music not registered! (call registerMusic first)");
		return;
	}
    this.timerstart = Date.now();
    createjs.Sound.play( this.musicfile );
};

SoundHandler.prototype.peek = function() {
    if ( this.timeline.length > 0 ) {
        return this.timeline[ 0 ];
    } else {
        return false;
    }
};

SoundHandler.prototype.pop = function() {
	if ( this.timeline.length > 0 ) {
		return this.timeline.shift();
	} else {
        return false;
    }
};

SoundHandler.prototype.process = function( e ) {
	if (!this.ready) return;
    if ( e.event == "musicevent" ) {
        var ev = new createjs.Event( "musicevent", true, true );
        ev.note = e.note;
        ev.data = e.data;
        this.eventStage.dispatchEvent( ev );
    }
};

SoundHandler.prototype.tick = function() {
	if (!this.ready) return;
    var difference = ( Date.now() - this.timerstart ) / 1000;
    var el = this.peek();
    while ( el && el.timestamp < difference ) {
        this.process( this.pop() );
        el = this.peek();
    }

};