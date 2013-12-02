jQuery(document).ready(function($) {

    // Check if the page is correct here (ie project.html)
    var pageCorrect = true;
    if (pageCorrect) {
        var canvas = jQuery('<canvas></canvas>');
        jQuery('#gameCanvasContainer').append(canvas);
        jQuery.getScript('./beatblaster/js/game.js', function(data, textStatus) {
            // Get an initializer from game and pass canvas as an argument
            initGame(canvas);
        });
        
    }
});