/* sticky nav bar */
$(window).scroll(function() {
    if ($(this).scrollTop()) {
        $('nav').addClass('sticky')
    } else {
        $('nav').removeClass('sticky')
    }
});