jQuery(document).ready(function($) {

    // Global variable to determine if site is run from server
    var ON_SERVER = true;
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
