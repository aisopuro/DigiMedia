// Builder class for constructing the necessary assets and linking them to a stage
function Builder (stage, loadQueue, completionCallback) {
    this.stage = stage;
    this.queue = loadQueue;
    this.complete = completionCallback;

    this.build()
}

// main build function for putting everything together
Builder.prototype.build = function() {
    console.log(this.stage);
    console.log(this.queue);
};