jQuery(document).ready(function($) {

    // Check if the page is correct here (ie project.html)
    var pageCorrect = true;
    if (pageCorrect) {
        var canvas = jQuery('<canvas></canvas>');
        var id = "gameCanvas";
        jQuery('#gameCanvasContainer').append(canvas);
        jQuery.getScript('./beatblaster/js/game.js', function(data, textStatus) {
            // Start up game script
            new Game(canvas, id);
        });
        
    }
});
