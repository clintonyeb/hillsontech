(function ($) {
    "use strict"; // Start of use strict

    $('.carousel').carousel({
        keyboard: false,
        pause: false,
        ride: true
    })

    $('body').scrollspy({
        target: '.navbar'
    })

})(jQuery);